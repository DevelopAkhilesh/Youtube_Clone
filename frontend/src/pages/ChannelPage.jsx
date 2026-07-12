// client/src/pages/ChannelPage.jsx — FE-07
// Rubric: Channel Page (40 marks) — create channel, list videos, edit/delete own videos.
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ChannelHeader from "../components/channel/ChannelHeader.jsx";
import ChannelVideoList from "../components/channel/ChannelVideoList.jsx";
import CreateChannelForm from "../components/channel/CreateChannelForm.jsx";
import { getChannelById, createChannel, toggleSubscribe } from "../services/channelService.js";
import { deleteVideo } from "../services/videoService.js";
import { useAuth } from "../hooks/useAuth.js";
import toast from "react-hot-toast";

function ChannelPage() {
  const { id } = useParams();
  const { user, isAuthed, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const isMe = id === "me";
  const isNew = id === "new";

  useEffect(() => {
    // "/channel/me" redirects to user's actual channel or /new
    if (isMe) {
      if (authLoading) return; // Wait for auth rehydration
      if (!isAuthed) {
        navigate("/login", { replace: true });
      } else if (user?.channels?.length) {
        navigate(`/channel/${user.channels[0]}`, { replace: true });
      } else {
        navigate("/channel/new", { replace: true });
      }
      return;
    }

    // "/channel/new" – show create form
    if (isNew) {
      setLoading(false);
      setShowCreateForm(isAuthed);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    getChannelById(id)
      .then((res) => {
        if (!cancelled) {
          // ✅ FIX: Backend returns channel directly
          setChannel(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Channel not found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, isAuthed, isMe, isNew, authLoading, user, navigate, refreshUser]);

  const isOwner = isAuthed && channel && user?._id === channel.owner?._id;

  // Check if user is subscribed to this channel
  const isSubscribed = isAuthed && channel && (user?.subscribedChannels || []).some(
    (c) => (typeof c === "string" ? c : c._id) === channel._id
  );

  const handleToggleSubscribe = async () => {
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    setSubscribeLoading(true);
    try {
      const res = await toggleSubscribe(channel._id);
      // Update local state instantly
      setChannel((prev) => ({ ...prev, subscribers: res.data.subscribers }));
      await refreshUser(); // Sync user.subscribedChannels
      toast.success(res.data.subscribed ? "Subscribed!" : "Unsubscribed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update subscription.");
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleCreateChannel = async (payload) => {
    setCreating(true);
    try {
      const res = await createChannel(payload);
      await refreshUser(); // Update AuthContext with new channel
      toast.success("Channel created successfully!");
      navigate(`/channel/${res.data.channel._id}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create channel.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    try {
      await deleteVideo(videoId);
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
      toast.success("Video deleted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video.");
    }
  };

  // ── Render states ──

  if (loading) {
    return <div className="cp-loading">Loading channel…</div>;
  }

  if (isNew && !isAuthed) {
    return (
      <div className="cp-gated">
        <p>You need to <Link to="/login">sign in</Link> to create a channel.</p>
      </div>
    );
  }

  if (isNew && showCreateForm) {
    return <CreateChannelForm onSubmit={handleCreateChannel} loading={creating} />;
  }

  if (error || !channel) {
    return (
      <div className="cp-error-page">
        <p>{error || "Channel not found."}</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="cp-body">
      <ChannelHeader
        channel={channel}
        isOwner={isOwner}
        isSubscribed={isSubscribed}
        subscribeLoading={subscribeLoading}
        onToggleSubscribe={handleToggleSubscribe}
      />

      <div className="cp-tabs">
        <button className="cp-tab cp-tab--active">Videos</button>
      </div>

      <div className="cp-content">
        <ChannelVideoList
          videos={channel.videos || []}
          isOwner={isOwner}
          onDelete={handleDeleteVideo}
        />
      </div>
    </div>
  );
}

export default ChannelPage;