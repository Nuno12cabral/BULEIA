import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ride } from '../types/driver';


export default function RideCard({ ride, onAccept, onReject }: { ride: Ride; onAccept: () => void; onReject: () => void }) {
return (
<View style={styles.card}>
<Text style={styles.title}>{ride.passengerName ?? 'Passageiro'}</Text>
<Text>Origem: {ride.origin.latitude.toFixed(4)}, {ride.origin.longitude.toFixed(4)}</Text>
<Text>Destino: {ride.destination.latitude.toFixed(4)}, {ride.destination.longitude.toFixed(4)}</Text>


<View style={styles.actions}>
<TouchableOpacity style={[styles.btn, styles.reject]} onPress={onReject}>
<Text style={styles.btnText}>Rejeitar</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.btn, styles.accept]} onPress={onAccept}>
<Text style={styles.btnText}>Aceitar</Text>
</TouchableOpacity>
</View>
</View>
);
}


const styles = StyleSheet.create({
card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 4, margin: 8 },
title: { fontWeight: '700', marginBottom: 4 },
actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
accept: { backgroundColor: '#1DB954' },
reject: { backgroundColor: '#FF3B30' },
btnText: { color: '#fff' },
});