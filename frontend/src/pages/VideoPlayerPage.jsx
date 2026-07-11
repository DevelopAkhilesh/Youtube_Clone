import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getVideoById,
  likeVideo,
  dislikeVideo,
} from "../services/videoService";
import { toggleSubscribe } from "../services/channelService";
import { addHistory } from "../services/userService";
import CommentSection from "../components/video/CommentSection";
import { formatViews, formatDate } from "../utils/formatViews";
import toast from "react-hot-toast";

function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // State
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch video
  useEffect(() => {
    let cancelled = false;

    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getVideoById(id);
        if (!cancelled) {
          const videoData = res.data;
          setVideo(videoData);

          // Set counts and states
          setLikesCount(videoData.likes?.length || 0);
          setDislikesCount(videoData.dislikes?.length || 0);

          // Check if user has liked/disliked
          if (user) {
            const userId = user._id;
            setUserHasLiked(
              videoData.likes?.some((uid) => uid === userId) || false
            );
            setUserHasDisliked(
              videoData.dislikes?.some((uid) => uid === userId) || false
            );
          }

          // Check if user is the owner
          if (user && videoData.uploader) {
            setIsOwner(user._id === videoData.uploader._id);
          }

          // Check subscription status
          if (user && videoData.channel) {
            const isSubbed =
              user.subscribedChannels?.some(
                (c) => c._id === videoData.channel._id
              ) || false;
            setIsSubscribed(isSubbed);
            setSubscribersCount(videoData.channel.subscribers || 0);
          }

          // Log watch history (non-blocking)
          if (user) {
            addHistory(id).catch(() => {
              // Silently fail – don't show error to user
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load video");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchVideo();

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  // Handlers
  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like videos");
      return;
    }

    try {
      const res = await likeVideo(id);
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserHasLiked(res.data.userHasLiked);
      // If liked, ensure dislike is false
      if (res.data.userHasLiked) {
        setUserHasDisliked(false);
      }
    } catch (err) {
      toast.error("Failed to like video");
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("Please log in to dislike videos");
      return;
    }

    try {
      const res = await dislikeVideo(id);
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserHasDisliked(res.data.userHasDisliked);
      // If disliked, ensure like is false
      if (res.data.userHasDisliked) {
        setUserHasLiked(false);
      }
    } catch (err) {
      toast.error("Failed to dislike video");
    }
  };

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
      const res = await toggleSubscribe(video.channel._id);
      setIsSubscribed(res.data.subscribed);
      setSubscribersCount(res.data.subscribers);
      await refreshUser(); // Refresh user state to update subscribedChannels
      toast.success(
        res.data.subscribed ? "Subscribed!" : "Unsubscribed"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        Loading video...
      </div>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "red" }}>
        {error || "Video not found"}
      </div>
    );
  }

  // Channel info
  const channel = video.channel;
  const uploader = video.uploader;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Video Player */}
        <div style={styles.videoWrapper}>
          <video
            src={video.videoUrl}
            controls
            autoPlay
            style={styles.videoPlayer}
            poster={video.thumbnailUrl}
          />
        </div>

        {/* Video Title */}
        <h1 style={styles.title}>{video.title}</h1>

        {/* Channel Info & Actions */}
        <div style={styles.channelBar}>
          <div style={styles.channelInfo}>
            <Link to={`/channel/${channel?._id}`}>
              <img
                src={channel?.avatar || "https://ui-avatars.com/api/?background=random&name=Channel"}
                alt={channel?.channelName}
                style={styles.channelAvatar}
              />
            </Link>
            <div>
              <Link to={`/channel/${channel?._id}`} style={styles.channelName}>
                {channel?.channelName || "Unknown Channel"}
              </Link>
              <span style={styles.subscriberCount}>
                {formatViews(subscribersCount)} subscribers
              </span>
            </div>
          </div>

          <div style={styles.actions}>
            {/* Subscribe Button */}
            {!isOwner && (
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
            )}

            {/* Like/Dislike Buttons */}
            <div style={styles.likeDislike}>
              <button
                onClick={handleLike}
                style={{
                  ...styles.likeBtn,
                  color: userHasLiked ? "#065fd4" : "#666",
                }}
              >
                👍 {likesCount > 0 && likesCount}
              </button>
              <button
                onClick={handleDislike}
                style={{
                  ...styles.dislikeBtn,
                  color: userHasDisliked ? "#065fd4" : "#666",
                }}
              >
                👎 {dislikesCount > 0 && dislikesCount}
              </button>
            </div>
          </div>
        </div>

        {/* Video Stats */}
        <div style={styles.stats}>
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>

        {/* Description */}
        {video.description && (
          <div style={styles.description}>
            <p>{video.description}</p>
          </div>
        )}

        {/* Comments Section */}
        <CommentSection videoId={id} />
      </div>

      {/* Right Sidebar – Related Videos */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>Related Videos</h3>
        {/* We'll implement Related Videos later */}
        <p style={{ color: "#606060" }}>Suggested videos will appear here</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  videoWrapper: {
    position: "relative",
    paddingBottom: "56.25%", // 16:9 aspect ratio
    height: 0,
    background: "#000",
    borderRadius: "8px",
    overflow: "hidden",
  },
  videoPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    margin: "16px 0 12px 0",
  },
  channelBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    padding: "12px 0",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
  },
  channelInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  channelAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },
  channelName: {
    fontWeight: "600",
    textDecoration: "none",
    color: "#000",
    fontSize: "16px",
  },
  subscriberCount: {
    display: "block",
    fontSize: "13px",
    color: "#606060",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  subscribeBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s",
  },
  likeDislike: {
    display: "flex",
    gap: "4px",
  },
  likeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "20px",
    transition: "background 0.2s",
  },
  dislikeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "20px",
    transition: "background 0.2s",
  },
  stats: {
    display: "flex",
    gap: "8px",
    color: "#606060",
    fontSize: "14px",
    marginTop: "8px",
  },
  description: {
    background: "#f9f9f9",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  sidebar: {
    width: "400px",
    flexShrink: 0,
    paddingLeft: "24px",
    borderLeft: "1px solid #ddd",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
  },
};

export default VideoPlayerPage;