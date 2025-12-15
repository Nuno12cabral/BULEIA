import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { finishRide } from '../../services/driverService';
import { useDriverStore } from '../../stores/useDriverStore';
import { useNavigation } from '@react-navigation/native';

export default function FinishRideScreen() {
  const ride = useDriverStore((s) => s.currentRide);
  const navigation = useNavigation();

  const handleFinish = async () => {
    await finishRide(ride.id);
    useDriverStore.getState().setCurrentRide(null);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Corrida?</Text>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Finalizar</Text>
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
