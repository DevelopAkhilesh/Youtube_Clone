import { useState } from "react";
import { Link } from "react-router-dom";

function CommentForm({ onSubmit, user, initialText = "", isEditing = false, onCancel }) {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await onSubmit(text.trim());
      if (!isEditing) {
        setText("");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.signInPrompt}>
        <Link to="/login">Sign in</Link> to comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputWrapper}>
        <img
          src={user.avatar || "https://ui-avatars.com/api/?background=random&name=User"}
          alt={user.username}
          style={styles.avatar}
        />
        <input
          type="text"
          placeholder={isEditing ? "" : "Write a comment..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
          disabled={loading}
        />
      </div>
      <div style={styles.actions}>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            opacity: !text.trim() || loading ? 0.5 : 1,
            cursor: !text.trim() || loading ? "not-allowed" : "pointer",
          }}
          disabled={!text.trim() || loading}
        >
          {loading ? "Saving..." : isEditing ? "Save" : "Comment"}
        </button>
      </div>
    </form>
  );
}

const styles = {
  signInPrompt: {
    padding: "12px 0",
    color: "#606060",
    fontSize: "14px",
  },
  form: {
    marginBottom: "16px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
  },
  input: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    background: "transparent",
    outline: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "6px 16px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  submitBtn: {
    padding: "6px 16px",
    border: "none",
    borderRadius: "20px",
    background: "#000",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default CommentForm;