import axios from 'axios';

// Use environment variable for cloud deployment, fallback to local proxy for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCities = async () => {
  const response = await api.get('/locations/cities');
  return response.data;
};

export const getAreas = async (cityId) => {
  const response = await api.get(`/locations/areas?city_id=${cityId}`);
  return response.data;
};

export const searchRestaurants = async (areaName) => {
  const response = await api.get(`/restaurants/?area=${areaName}`);
  return response.data;
};

export const getRestaurantDetails = async (placeId) => {
  const response = await api.get(`/restaurants/${placeId}`);
  return response.data;
};

export default api;
