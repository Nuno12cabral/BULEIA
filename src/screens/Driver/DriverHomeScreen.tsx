// src/screens/Driver/DriverHomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDriverStore } from '../../stores/useDriverStore';
import OnlineToggleButton from '../../components/OnlineToggleButton';
import MapHeader from '../../components/MapHeader';
import { watchLocation } from '../../services/locationService';
import { connectSocket, disconnectSocket, updateLocation, onIncomingRide } from '../../services/socketService';
import { Ride, Coordinates } from '../../types/driver';


export default function DriverHomeScreen() {
const profile = useDriverStore((s) => s.profile);
const online = useDriverStore((s) => s.online);
const setCurrentRide = useDriverStore((s) => s.setCurrentRide);


const [location, setLocation] = useState<Coordinates | null>(null);


useEffect(() => {
if (!profile) return;


// Conecta socket
const socket = connectSocket(profile.id, () => console.log('Driver socket connected'));


// Receber rides
onIncomingRide((ride: Ride) => {
Alert.alert('Nova corrida!', `Origem: ${ride.origin.latitude.toFixed(4)}, ${ride.origin.longitude.toFixed(4)}`);
setCurrentRide(ride);
// Navegar para DriverIncomingRequestScreen aqui se usar React Navigation
});


// Inicia watchLocation
const stopWatching = watchLocation((coords) => {
setLocation(coords);
updateLocation(coords);
});


return () => {
disconnectSocket();
stopWatching?.();
};
}, [profile]);


return (
<View style={styles.container}>
<MapHeader title={`Olá, ${profile?.name ?? 'Motorista'}`} />
{location ? (
<MapView
style={styles.map}
initialRegion={{
latitude: location.latitude,
longitude: location.longitude,
latitudeDelta: 0.01,
longitudeDelta: 0.01,
}}
>
<Marker coordinate={location} title="Você" />
</MapView>
) : (
<Text style={styles.loading}>A obter localização...</Text>
)}
<OnlineToggleButton />
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1 },
map: { flex: 1 },
loading: { flex: 1, textAlign: 'center', textAlignVertical: 'center' },
});