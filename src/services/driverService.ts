import axios from 'axios';
import { useDriverStore } from '../stores/useDriverStore';
import { Ride } from '../types/ride';

const API_URL = 'https://your-backend.com/rides'; // substituir pela URL real

export const getPendingRides = async () => {
  const res = await axios.get(`${API_URL}/pending`);
  return res.data;
};

export const acceptRide = async (rideId: string) => {
  const res = await axios.post(`${API_URL}/${rideId}/accept`);
  useDriverStore.getState().setCurrentRide(res.data);
  return res.data;
};

export const startRide = async (rideId: string) => {
  const res = await axios.post(`${API_URL}/${rideId}/start`);
  useDriverStore.getState().setCurrentRide(res.data);
  return res.data;
};

export const finishRide = async (rideId: string) => {
  const res = await axios.post(`${API_URL}/${rideId}/complete`);
  useDriverStore.getState().setCurrentRide(null);
  return res.data;
};

export const updateDriverLocation = async (rideId: string, lat: number, lng: number) => {
  const res = await axios.post(`${API_URL}/${rideId}/location`, { lat, lng });
  useDriverStore.getState().setLocation({ latitude: lat, longitude: lng });
  return res.data;
};
