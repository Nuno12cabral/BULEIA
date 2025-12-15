import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DriverProfile, Ride, Coordinates } from '../types/driver';

type DriverState = {
  /* ===================== STATE ===================== */
  profile: DriverProfile | null;
  online: boolean;
  location: Coordinates | null;
  currentRide: Ride | null;
  earningsMonth: number;

  /* ===================== ACTIONS ===================== */
  setProfile: (p: DriverProfile | null) => void;
  setOnline: (v: boolean) => void;
  setLocation: (c: Coordinates | null) => void;

  /* Ride lifecycle */
  setCurrentRide: (r: Ride | null) => void;
  clearCurrentRide: () => void;
  setRideStatus: (status: Ride['status']) => void;

  /* Ride helpers */
  acceptRide: (ride: Ride) => void;
  startRide: () => void;
  finishRide: (finalPrice?: number) => void;
  cancelRide: (reason?: string) => void;

  /* Earnings */
  addEarnings: (amount: number) => void;
  resetEarnings: () => void;

  /* System */
  reset: () => void;
};

export const useDriverStore = create<DriverState>()(
  persist(
    (set, get) => ({
      /* ===================== INITIAL STATE ===================== */
      profile: null,
      online: false,
      location: null,
      currentRide: null,
      earningsMonth: 0,

      /* ===================== BASIC SETTERS ===================== */
      setProfile: (p) => set({ profile: p }),
      setOnline: (v) => set({ online: v }),
      setLocation: (c) => set({ location: c }),

      /* ===================== RIDE CORE ===================== */
      setCurrentRide: (r) => set({ currentRide: r }),
      clearCurrentRide: () => set({ currentRide: null }),

      setRideStatus: (status) => {
        const ride = get().currentRide;
        if (!ride) return;

        set({
          currentRide: {
            ...ride,
            status,
          },
        });
      },

      /* ===================== RIDE FLOW ===================== */
      acceptRide: (ride) =>
        set({
          currentRide: {
            ...ride,
            status: 'accepted',
            acceptedAt: new Date().toISOString(),
          },
        }),

      startRide: () => {
        const ride = get().currentRide;
        if (!ride) return;

        set({
          currentRide: {
            ...ride,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
          },
        });
      },

      finishRide: (finalPrice) => {
        const ride = get().currentRide;
        if (!ride) return;

        const price = finalPrice ?? ride.estimatedPrice ?? 0;

        set((state) => ({
          currentRide: null,
          earningsMonth: state.earningsMonth + price,
        }));
      },

      cancelRide: (reason) => {
        const ride = get().currentRide;
        if (!ride) return;

        set({
          currentRide: {
            ...ride,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            cancelReason: reason,
          },
        });
      },

      /* ===================== EARNINGS ===================== */
      addEarnings: (amount) =>
        set((s) => ({ earningsMonth: s.earningsMonth + amount })),

      resetEarnings: () => set({ earningsMonth: 0 }),

      /* ===================== RESET ===================== */
      reset: () =>
        set({
          profile: null,
          online: false,
          location: null,
          currentRide: null,
          earningsMonth: 0,
        }),
    }),
    {
      name: 'driver-storage',
    }
  )
);
