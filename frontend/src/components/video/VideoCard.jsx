import { Link } from "react-router-dom";
import { formatViews, formatDate } from "../../utils/formatViews";

function VideoCard({ video }) {
  const { _id, title, thumbnailUrl, channel, views, createdAt } = video;
  const avatar =
    channel?.avatar ||
    "https://ui-avatars.com/api/?background=random&name=Channel";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
      }}
    >
      <Link to={`/video/${_id}`}>
        <img
          src={thumbnailUrl}
          alt={title}
          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }}
        />
      </Link>
      <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
        <Link to={`/channel/${channel?._id}`}>
          <img
            src={avatar}
            alt={channel?.channelName}
            style={{ width: "36px", height: "36px", borderRadius: "50%" }}
          />
        </Link>
        <div style={{ flex: 1 }}>
          <Link
            to={`/video/${_id}`}
            style={{
              fontWeight: 600,
              textDecoration: "none",
              color: "#000",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </Link>
          <Link
            to={`/channel/${channel?._id}`}
            style={{
              display: "block",
              color: "#606060",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            {channel?.channelName || "Unknown"}
          </Link>
          <span style={{ color: "#606060", fontSize: "13px" }}>
            {formatViews(views)} • {formatDate(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;