export type Coordinates = { latitude: number; longitude: number };


export type DriverProfile = {
id: string;
name: string;
vehicle?: { model?: string; plate?: string } | null;
rating?: number;
};


export type Ride = {
id: string;
passengerName?: string;
origin: Coordinates;
destination: Coordinates;
status: 'incoming' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
fare?: number;
};