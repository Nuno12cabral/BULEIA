import create from 'zustand';
import { persist } from 'zustand/middleware';
import { RiderProfile, Ride, Coordinates } from '../types/driver';


type RiderState = {
profile?: RiderProfile | null;
currentRide?: Ride | null;
location?: Coordinates | null;
setProfile: (p: RiderProfile) => void;
setCurrentRide: (r?: Ride | null) => void;
setLocation: (c: Coordinates) => void;
reset: () => void;
};


export const useRiderStore = create<RiderState>()(
persist(
(set) => ({
profile: null,
currentRide: null,
location: null,
setProfile: (p) => set({ profile: p }),
setCurrentRide: (r) => set({ currentRide: r ?? null }),
setLocation: (c) => set({ location: c }),
reset: () => set({ profile: null, currentRide: null, location: null }),
}),
{ name: 'rider-storage' }
)
);