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

export const getVehicles = async () => {
  const response = await api.get('/get_vehicles');
  return response.data;
};

export const getDrivers = async () => {
  const response = await api.get('/get_drivers');
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

export const getTrips = async () => {
  const response = await api.get('/get_trips');
  return response.data;
};

export const updateTripStatus = async (data) => {
  const response = await api.put('/trip_status', data);
  return response.data;
};

export default api;
