import api from "./api";

export const getCommentsForVideo = (videoId) =>
  api.get(`/comments/video/${videoId}`);

export const addComment = (data) => api.post("/comments", data);

export const updateComment = (id, data) =>
  api.put(`/comments/${id}`, data);

export const deleteComment = (id) => api.delete(`/comments/${id}`);