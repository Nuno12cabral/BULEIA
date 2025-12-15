import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { acceptRide } from '../../services/driverService';
import { useDriverStore } from '../../stores/useDriverStore';

export default function AcceptRideScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ride } = route.params as any;
  const { setCurrentRide } = useDriverStore();

  const handleAccept = async () => {
    const updated = await acceptRide(ride.id);
    setCurrentRide(updated);
    navigation.navigate('NavigationToPassenger');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aceitar Corrida?</Text>

      <Text>Passageiro: {ride.rider.name}</Text>
      <Text>Origem: {ride.pickup.address}</Text>
      <Text>Destino: {ride.destination.address}</Text>

      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.buttonText}>Aceitar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  button: { marginTop: 20, backgroundColor: '#1DB954', padding: 16, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 17 },
});
