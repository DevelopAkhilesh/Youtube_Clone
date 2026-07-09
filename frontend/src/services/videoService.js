import api from "./api";

export const getVideos = (params) => api.get("/videos", { params });
export const getVideoById = (id) => api.get(`/videos/${id}`);
export const createVideo = (data) => api.post("/videos", data);
export const updateVideo = (id, data) => api.put(`/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/videos/${id}`);
export const likeVideo = (id) => api.post(`/videos/${id}/like`);
export const dislikeVideo = (id) => api.post(`/videos/${id}/dislike`);