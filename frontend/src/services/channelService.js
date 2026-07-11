import api from "./api";

export const createChannel = (data) => api.post("/channels", data);
export const getChannelById = (id) => api.get(`/channels/${id}`);
export const updateChannel = (id, data) => api.put(`/channels/${id}`, data);
export const toggleSubscribe = (id) => api.post(`/channels/${id}/subscribe`);