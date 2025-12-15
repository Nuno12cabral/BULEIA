import io from 'socket.io-client';
import { useRiderStore } from '../stores/useRiderStore';


let socket: any = null;


export const connectRiderSocket = (riderId: string) => {
socket = io('http://YOUR_BACKEND_URL');


socket.on('connect', () => {
console.log('Rider connected to socket', riderId);
socket.emit('rider:join', { riderId });
});


// Receber notificação de motorista atribuído
socket.on('ride:assigned', (ride: any) => {
	console.log('Driver assigned:', ride);
	useRiderStore.getState().setCurrentRide(ride);
});


return socket;
};


export const disconnectRiderSocket = () => {
if (socket) socket.disconnect();
};