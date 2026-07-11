import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getCommentsForVideo,
  addComment,
  updateComment,
  deleteComment,
} from "../../services/commentService";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import toast from "react-hot-toast";

function CommentSection({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments
  useEffect(() => {
    let cancelled = false;

    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCommentsForVideo(videoId);
        if (!cancelled) {
          setComments(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  // Handlers
  const handleAddComment = async (text) => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    try {
      const res = await addComment({ video: videoId, text });
      setComments([res.data.comment, ...comments]);
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleEditComment = async (commentId, text) => {
    try {
      const res = await updateComment(commentId, { text });
      setComments(
        comments.map((c) =>
          c._id === commentId ? res.data.comment : c
        )
      );
      toast.success("Comment updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading comments: {error}</div>;
  }

  return (
    <div style={{ marginTop: "32px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
        {comments.length} Comments
      </h3>

      <CommentForm onSubmit={handleAddComment} user={user} />

      <div style={{ marginTop: "16px" }}>
        {comments.length === 0 ? (
          <p style={{ color: "#606060" }}>No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;