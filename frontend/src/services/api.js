import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const registerVehicle = async (data) => {
  const response = await api.post('/vehicle_register', data);
  return response.data;
};

export const getVehicles = async (uid) => {
  const response = await api.post('/vehicles', { uid });
  return response.data;
};

export const getDrivers = async (uid) => {
  const response = await api.post('/drivers', { uid });
  return response.data;
};

export const addDriver = async (data) => {
  const response = await api.post('/driver_add', data);
  return response.data;
};

export const updateDriverStatus = async (data) => {
  const response = await api.put('/driver_status', data);
  return response.data;
};

export const getAvailableVehicles = async () => {
  const response = await api.get('/vehicles_available');
  return response.data;
};

export const getAvailableDrivers = async () => {
  const response = await api.get('/drivers_available');
  return response.data;
};

export const createTrip = async (data) => {
  const response = await api.post('/trip', data);
  return response.data;
};

export const getTrips = async (uid) => {
  const response = await api.post('/get_trips', { uid });
  return response.data;
};

export const updateTripStatus = async (data) => {
  const response = await api.put('/trip_status', data);
  return response.data;
};

export const getMaintenance = async (uid) => {
  const response = await api.post('/maintenance', { uid });
  return response.data;
};

export const registerMaintenance = async (data) => {
  const response = await api.post('/maintenance/register', data);
  return response.data;
};

export const updateMaintenanceStatus = async (data) => {
  const response = await api.put('/maintenance/status', data);
  return response.data;
};

export default api;
