import { io, Socket } from 'socket.io-client';
import { Ride, Coordinates } from '../types/driver';

let socket: Socket | null = null;

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'https://socket.exemplo.com';

export function connectSocket(driverId?: string, onConnect?: () => void) {
  if (socket && socket.connected) return socket;

  socket = io(SOCKET_URL, { 
    query: driverId ? { driverId } : {}, 
    transports: ['websocket'] 
  });

  socket.on('connect', () => {
    console.log('socket connected', socket?.id);
    onConnect?.();
  });

  socket.on('disconnect', (reason) => console.log('socket disconnected', reason));

  // Eventos de exemplo
  socket.on('ride:incoming', (ride: Ride) => console.log('ride incoming', ride));
  socket.on('ride:assigned', (ride: Ride) => console.log('ride assigned', ride));
  socket.on('ride:updated', (ride: Ride) => console.log('ride updated', ride));

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

// Rider
export function onIncomingRide(cb: (ride: Ride) => void) {
  socket?.on('ride:incoming', cb);
}

export function onDriverAssigned(cb: (ride: Ride) => void) {
  socket?.on('ride:assigned', cb);
}

export function onRideUpdated(cb: (ride: Ride) => void) {
  socket?.on('ride:updated', cb);
}

// Driver
export function acceptRide(rideId: string) {
  socket?.emit('ride:accept', { rideId });
}

export function updateLocation(coords: Coordinates) {
  socket?.emit('driver:location', coords);
}

export default {
  connectSocket,
  disconnectSocket,
  onIncomingRide,
  onDriverAssigned,
  onRideUpdated,
  acceptRide,
  updateLocation,
};
