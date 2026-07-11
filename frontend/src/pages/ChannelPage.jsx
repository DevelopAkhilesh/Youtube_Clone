import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getChannelById,
  toggleSubscribe,
  updateChannel,
  createChannel,
} from "../services/channelService";
import { deleteVideo } from "../services/videoService";
import VideoCard from "../components/video/VideoCard";
import { formatNumber } from "../utils/formatViews.js";
import toast from "react-hot-toast";

function ChannelPage() {
  const { id } = useParams();          // undefined for /channel/me and /channel/new
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // State
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    channelName: "",
    description: "",
    banner: "",
    avatar: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    channelName: "",
    description: "",
    banner: "",
    avatar: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchChannel = async () => {
      const path = location.pathname;

      // --- Case 1: /channel/me ---
      if (path === "/channel/me") {
        if (!user) {
          navigate("/login");
          return;
        }
        if (user.channels && user.channels.length > 0) {
          const firstChannelId = user.channels[0];
          if (firstChannelId) {
            navigate(`/channel/${firstChannelId}`);
            return;
          }
        }
        navigate("/channel/new");
        return;
      }

      // --- Case 2: /channel/new ---
      if (path === "/channel/new") {
        setShowCreateForm(true);
        setLoading(false);
        return;
      }

      // --- Case 3: Any other path – we expect an ID ---
      // If id is undefined (shouldn't happen for /channel/something, but just in case)
      if (!id) {
        setError("Channel ID is missing");
        setLoading(false);
        return;
      }

      // Validate that id is a 24-character hex (MongoDB ObjectId)
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        setError("Invalid channel ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await getChannelById(id);
        if (!cancelled) {
          const data = res.data;
          setChannel(data);
          setVideos(data.videos || []);
          setSubscribersCount(data.subscribers || 0);

          if (user && data.owner) {
            const ownerId = data.owner._id || data.owner;
            setIsOwner(user._id === ownerId);
          }

          if (user && data._id) {
            const isSubbed =
              user.subscribedChannels?.some(
                (c) => c._id === data._id || c === data._id
              ) || false;
            setIsSubscribed(isSubbed);
          }

          setEditForm({
            channelName: data.channelName || "",
            description: data.description || "",
            banner: data.banner || "",
            avatar: data.avatar || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load channel");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchChannel();

    return () => {
      cancelled = true;
    };
  }, [id, location.pathname, user, navigate]);

  // --- Handlers (unchanged) ---
  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }
    if (isOwner) {
      toast.error("You cannot subscribe to your own channel");
      return;
    }
    try {
      const res = await toggleSubscribe(channel._id);
      setIsSubscribed(res.data.subscribed);
      setSubscribersCount(res.data.subscribers);
      await refreshUser();
      toast.success(res.data.subscribed ? "Subscribed!" : "Unsubscribed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    }
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await updateChannel(channel._id, editForm);
      setChannel(res.data.channel);
      setEditForm({
        channelName: res.data.channel.channelName,
        description: res.data.channel.description,
        banner: res.data.channel.banner,
        avatar: res.data.channel.avatar,
      });
      setIsEditing(false);
      toast.success("Channel updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update channel");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteVideo(videoId);
      setVideos(videos.filter((v) => v._id !== videoId));
      toast.success("Video deleted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!createForm.channelName.trim()) {
      toast.error("Channel name is required");
      return;
    }
    setCreating(true);
    try {
      const res = await createChannel(createForm);
      await refreshUser();
      toast.success("Channel created!");
      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create channel");
    } finally {
      setCreating(false);
    }
  };

  // --- Render: Create Channel Form ---
  if (showCreateForm) {
    return (
      <div style={styles.container}>
        <div style={styles.createCard}>
          <h2>Create a Channel</h2>
          <form onSubmit={handleCreateChannel}>
            <div style={styles.field}>
              <label>Channel Name *</label>
              <input
                type="text"
                value={createForm.channelName}
                onChange={(e) =>
                  setCreateForm({ ...createForm, channelName: e.target.value })
                }
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label>Description</label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                style={styles.textarea}
              />
            </div>
            <div style={styles.field}>
              <label>Banner URL</label>
              <input
                type="text"
                value={createForm.banner}
                onChange={(e) =>
                  setCreateForm({ ...createForm, banner: e.target.value })
                }
                style={styles.input}
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            <div style={styles.field}>
              <label>Avatar URL</label>
              <input
                type="text"
                value={createForm.avatar}
                onChange={(e) =>
                  setCreateForm({ ...createForm, avatar: e.target.value })
                }
                style={styles.input}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <button type="submit" disabled={creating} style={styles.submitBtn}>
              {creating ? "Creating..." : "Create Channel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Loading / Error ---
  if (loading) {
    return <div style={{ textAlign: "center", padding: "60px" }}>Loading channel...</div>;
  }

  if (error || !channel) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "red" }}>
        {error || "Channel not found"}
      </div>
    );
  }

  // --- Main Channel View ---
  return (
    <div style={styles.container}>
      {/* Banner */}
      <div style={styles.bannerWrapper}>
        <img
          src={channel.banner || "https://via.placeholder.com/2560x400?text=Channel+Banner"}
          alt="Channel banner"
          style={styles.banner}
        />
        <div style={styles.overlay} />
      </div>

      {/* Channel Info */}
      <div style={styles.infoBar}>
        <img
          src={channel.avatar || "https://ui-avatars.com/api/?background=random&name=Channel"}
          alt={channel.channelName}
          style={styles.avatar}
        />
        <div style={styles.info}>
          <h1 style={styles.name}>{channel.channelName}</h1>
          <span style={styles.handle}>{channel.handle}</span>
          <span style={styles.subscribers}>
            {formatNumber(subscribersCount)} subscribers
          </span>
          {channel.description && (
            <p style={styles.description}>{channel.description}</p>
          )}
        </div>
        <div style={styles.actions}>
          {!isOwner ? (
            <button
              onClick={handleSubscribe}
              style={{
                ...styles.subscribeBtn,
                background: isSubscribed ? "#ccc" : "#000",
                color: isSubscribed ? "#000" : "#fff",
              }}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={styles.editBtn}
              >
                Edit Channel
              </button>
              <Link to="/upload" style={styles.uploadBtn}>
                Upload Video
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div style={styles.editCard}>
          <h3>Edit Channel</h3>
          <form onSubmit={handleUpdateChannel}>
            <div style={styles.field}>
              <label>Channel Name</label>
              <input
                type="text"
                value={editForm.channelName}
                onChange={(e) =>
                  setEditForm({ ...editForm, channelName: e.target.value })
                }
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label>Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                style={styles.textarea}
              />
            </div>
            <div style={styles.field}>
              <label>Banner URL</label>
              <input
                type="text"
                value={editForm.banner}
                onChange={(e) =>
                  setEditForm({ ...editForm, banner: e.target.value })
                }
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label>Avatar URL</label>
              <input
                type="text"
                value={editForm.avatar}
                onChange={(e) =>
                  setEditForm({ ...editForm, avatar: e.target.value })
                }
                style={styles.input}
              />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" style={styles.saveBtn}>
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video Grid */}
      <div style={styles.videoSection}>
        <h2 style={styles.videoTitle}>Videos</h2>
        {videos.length === 0 ? (
          <p style={{ color: "#606060" }}>
            {isOwner
              ? "You haven't uploaded any videos yet. Click 'Upload Video' to get started."
              : "No videos uploaded yet."}
          </p>
        ) : (
          <div style={styles.videoGrid}>
            {videos.map((video) => (
              <div key={video._id} style={styles.videoCardWrapper}>
                <VideoCard video={video} />
                {isOwner && (
                  <div style={styles.videoActions}>
                    <Link to={`/upload/${video._id}`} style={styles.editVideoBtn}>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      style={styles.deleteVideoBtn}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Styles (unchanged) ---
const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px" },
  bannerWrapper: { position: "relative", width: "100%", height: "200px", overflow: "hidden", borderRadius: "8px" },
  banner: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(transparent, rgba(0,0,0,0.3))" },
  infoBar: { display: "flex", alignItems: "center", gap: "20px", padding: "20px 0", borderBottom: "1px solid #ddd", flexWrap: "wrap" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" },
  info: { flex: 1 },
  name: { fontSize: "28px", fontWeight: "700", margin: "0" },
  handle: { display: "block", color: "#606060", fontSize: "14px", margin: "4px 0" },
  subscribers: { display: "block", color: "#606060", fontSize: "14px", margin: "4px 0" },
  description: { marginTop: "8px", color: "#333" },
  actions: { display: "flex", gap: "12px", alignItems: "center" },
  subscribeBtn: { padding: "8px 20px", borderRadius: "20px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px", transition: "background 0.2s" },
  editBtn: { padding: "8px 16px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontSize: "14px" },
  uploadBtn: { padding: "8px 16px", borderRadius: "4px", border: "1px solid #000", background: "#000", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "500" },
  editCard: { background: "#f9f9f9", padding: "20px", borderRadius: "8px", margin: "20px 0" },
  field: { marginBottom: "12px" },
  input: { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box", minHeight: "80px" },
  saveBtn: { padding: "8px 16px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { padding: "8px 16px", background: "none", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" },
  submitBtn: { padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" },
  videoSection: { marginTop: "32px" },
  videoTitle: { fontSize: "20px", fontWeight: "600", marginBottom: "16px" },
  videoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  videoCardWrapper: { position: "relative" },
  videoActions: { display: "flex", gap: "8px", marginTop: "8px" },
  editVideoBtn: { padding: "4px 12px", background: "#f1f1f1", color: "#333", borderRadius: "4px", textDecoration: "none", fontSize: "12px" },
  deleteVideoBtn: { padding: "4px 12px", background: "#dc3545", color: "#fff", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "12px" },
  createCard: { maxWidth: "500px", margin: "40px auto", background: "#fff", padding: "32px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
};

export default ChannelPage;