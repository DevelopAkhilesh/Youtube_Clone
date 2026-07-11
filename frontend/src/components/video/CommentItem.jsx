import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatViews";
import CommentForm from "./CommentForm";

function CommentItem({ comment, user, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = user && comment.user && user._id === comment.user._id;

  const handleEdit = async (text) => {
    await onEdit(comment._id, text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={styles.container}>
        <CommentForm
          initialText={comment.text}
          isEditing
          onSubmit={handleEdit}
          user={user}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to={`/channel/${comment.user?._id}`}>
        <img
          src={comment.user?.avatar || "https://ui-avatars.com/api/?background=random&name=User"}
          alt={comment.user?.username}
          style={styles.avatar}
        />
      </Link>
      <div style={styles.content}>
        <div style={styles.header}>
          <Link to={`/channel/${comment.user?._id}`} style={styles.username}>
            @{comment.user?.username || "Unknown"}
          </Link>
          <span style={styles.date}>{formatDate(comment.createdAt)}</span>
        </div>
        <p style={styles.text}>{comment.text}</p>
        {isOwner && (
          <div style={styles.actions}>
            <button onClick={() => setIsEditing(true)} style={styles.actionBtn}>
              Edit
            </button>
            <button onClick={() => onDelete(comment._id)} style={styles.actionBtn}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f1f1f1",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  username: {
    fontWeight: "600",
    fontSize: "14px",
    textDecoration: "none",
    color: "#000",
  },
  date: {
    fontSize: "13px",
    color: "#606060",
  },
  text: {
    margin: "0",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#606060",
    fontSize: "13px",
    cursor: "pointer",
    padding: "2px 8px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
};

export default CommentItem;