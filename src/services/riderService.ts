import api from './api';
import { Ride } from '../types/driver';

type RequestRidePayload = {
  customerId: string;
  customerName: string;
  serviceType: string;
  origin: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  estimatedPrice: number;
};

// Solicitar nova corrida
export async function requestRide(payload: RequestRidePayload): Promise<Ride> {
  const res = await api.post<Ride>('/rides/request', payload);
  return res.data;
}

// Obter detalhes de uma corrida
export async function getRide(rideId: string): Promise<Ride> {
  const res = await api.get<Ride>(`/rides/${rideId}`);
  return res.data;
}

// Obter corrida ativa de um passageiro
export async function getActiveRideForCustomer(customerId: string): Promise<Ride | null> {
  const res = await api.get<Ride | null>(`/rides/customer/${customerId}/active`);
  return res.data;
}

// Finalizar corrida
export async function completeRide(rideId: string): Promise<Ride> {
  const res = await api.post<Ride>(`/rides/${rideId}/complete`);
  return res.data;
}

// Cancelar corrida
export async function cancelRide(rideId: string, cancelledBy: 'customer' | 'driver' = 'customer') {
  const res = await api.post(`/rides/${rideId}/cancel`, { cancelledBy });
  return res.data;
}

// Avaliar corrida
export async function rateRide(rideId: string, rating: number, review?: string) {
  const res = await api.post(`/rides/${rideId}/rate`, { rating, review });
  return res.data;
}

// Atualizar localização do passageiro (opcional)
export async function updateLocation(rideId: string, lat: number, lng: number) {
  const res = await api.post(`/rides/${rideId}/location`, { lat, lng });
  return res.data;
}

// Atualizar status da corrida (ex: 'accepted', 'in_progress', etc.) – opcional
export async function updateRideStatus(rideId: string, status: Ride['status']) {
  const res = await api.post(`/rides/${rideId}/status`, { status });
  return res.data;
}

export default {
  requestRide,
  getRide,
  getActiveRideForCustomer,
  completeRide,
  cancelRide,
  rateRide,
  updateLocation,
  updateRideStatus,
};
