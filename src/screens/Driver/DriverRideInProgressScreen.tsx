import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDriverStore } from '../../stores/useDriverStore';
import { updateLocation, completeRide } from '../../services/socketService';
import { watchLocation } from '../../services/locationService';


export default function DriverRideInProgressScreen() {
const currentRide = useDriverStore((s) => s.currentRide);
const setCurrentRide = useDriverStore((s) => s.setCurrentRide);
const [location, setLocation] = useState(currentRide?.origin ?? null);


useEffect(() => {
if (!currentRide) return;


const stopWatching = watchLocation((coords) => {
setLocation(coords);
updateLocation(coords);
});


return () => stopWatching?.();
}, [currentRide]);


if (!currentRide) return null;


const handleComplete = () => {
completeRide(currentRide.id);
setCurrentRide(null);
Alert.alert('Corrida concluída!');
};


return (
<View style={styles.container}>
{location && (
<MapView
style={styles.map}
initialRegion={{
latitude: location.latitude,
longitude: location.longitude,
latitudeDelta: 0.01,
longitudeDelta: 0.01,
}}
>
<Marker coordinate={currentRide.origin} title="Origem" />
<Marker coordinate={currentRide.destination} title="Destino" />
<Marker coordinate={location} title="Você" pinColor="blue" />
</MapView>
)}
<TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
<Text style={styles.completeButtonText}>Concluir Corrida</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1 },
map: { flex: 1 },
completeButton: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#1DB954', padding: 16, borderRadius: 8 },
completeButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});