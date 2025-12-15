import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDriverStore } from '../../stores/useDriverStore';
import { acceptRide, rejectRide } from '../../services/socketService';


export default function DriverIncomingRequestScreen() {
const navigation = useNavigation();
const currentRide = useDriverStore((s) => s.currentRide);
const setCurrentRide = useDriverStore((s) => s.setCurrentRide);


if (!currentRide) return null;


const handleAccept = () => {
acceptRide(currentRide.id);
navigation.navigate('DriverRideInProgress');
};


const handleReject = () => {
rejectRide(currentRide.id);
setCurrentRide(null);
Alert.alert('Corrida rejeitada');
navigation.goBack();
};


return (
<View style={styles.container}>
<Text style={styles.title}>Nova Corrida!</Text>
<Text>Origem: {currentRide.origin.latitude.toFixed(4)}, {currentRide.origin.longitude.toFixed(4)}</Text>
<Text>Destino: {currentRide.destination.latitude.toFixed(4)}, {currentRide.destination.longitude.toFixed(4)}</Text>


<View style={styles.buttonsContainer}>
<TouchableOpacity style={[styles.button, styles.accept]} onPress={handleAccept}>
<Text style={styles.buttonText}>Aceitar</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.button, styles.reject]} onPress={handleReject}>
<Text style={styles.buttonText}>Rejeitar</Text>
</TouchableOpacity>
</View>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
buttonsContainer: { flexDirection: 'row', marginTop: 24 },
button: { padding: 16, borderRadius: 8, marginHorizontal: 8 },
accept: { backgroundColor: '#1DB954' },
reject: { backgroundColor: '#FF3B30' },
buttonText: { color: '#fff', fontWeight: '600' },
});