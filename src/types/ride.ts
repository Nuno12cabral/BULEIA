// /types/ride.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RideUser {
  id: string;
  name: string;
  photo?: string;
  rating?: number;
}

export interface VehicleInfo {
  model: string;
  plate: string;
  year?: number;
}

export type RideStatus = 
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Ride {
  id: string;                     // ride:timestamp:random
  customer: RideUser;
  driver?: RideUser | null;       // null até ser aceita
  driverVehicle?: VehicleInfo | null;
  serviceType: 'taxi-economy' | 'taxi-premium' | 'hiace';
  origin: {
    address: string;
    coords: Coordinates;
  };
  destination: {
    address: string;
    coords: Coordinates;
  };
  estimatedPrice: number;
  finalPrice?: number | null;
  currency: string;               // ex: CVE
  status: RideStatus;
  requestedAt: string;            // ISO timestamp
  acceptedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: 'customer' | 'driver' | null;
  rating?: number | null;
  review?: string | null;
  distance?: number;              // km
  duration?: number;              // minutos
  currentLocation?: Coordinates;  // posição em tempo real do motorista
}
