import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { startRide } from '../../services/driverService';
import { useDriverStore } from '../../stores/useDriverStore';
import { useNavigation } from '@react-navigation/native';

export default function StartRideScreen() {
  const ride = useDriverStore((s) => s.currentRide);
  const setCurrentRide = useDriverStore((s) => s.setCurrentRide);
  const navigation = useNavigation();

  const handleStart = async () => {
    const updated = await startRide(ride.id);
    setCurrentRide(updated);
    navigation.navigate('InRide');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Corrida?</Text>
      <Text>Passageiro: {ride.rider.name}</Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Iniciar Corrida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  button: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 17 },
});
