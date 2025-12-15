import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRiderStore } from '../../store/useRiderStore';
import { Ride } from '../../types/ride';

export default function ConfirmRideScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { destination, serviceType, estimatedPrice } = route.params;
  const { setCurrentRide } = useRiderStore();

  // TEMPORÁRIO – depois será a localização real do device
  const origin = {
    address: 'Minha localização atual',
    coords: { lat: 0, lng: 0 },
  };

  const handleConfirm = () => {
    const ride: Ride = {
      id: `ride:${Date.now()}`,
      customer: {
        id: 'local-user',
        name: 'Passageiro',
      },
      driver: null,
      driverVehicle: null,
      serviceType,
      origin,
      destination,
      estimatedPrice,
      finalPrice: null,
      currency: 'CVE',
      status: 'requested',
      requestedAt: new Date().toISOString(),
      acceptedAt: null,
      startedAt: null,
      completedAt: null,
      cancelledAt: null,
      cancelledBy: null,
      rating: null,
      review: null,
      distance: undefined,
      duration: undefined,
      currentLocation: undefined,
    };

    setCurrentRide(ride);

    navigation.navigate('WaitingDriver');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Confirmar Corrida</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Origem</Text>
        <Text style={styles.value}>{origin.address}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Destino</Text>
        <Text style={styles.value}>{destination.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Serviço</Text>
        <Text style={styles.value}>{serviceType}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Preço Estimado</Text>
        <Text style={styles.price}>{estimatedPrice} CVE</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar Corrida</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#1DB954',
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
