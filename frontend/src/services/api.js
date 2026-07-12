import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
