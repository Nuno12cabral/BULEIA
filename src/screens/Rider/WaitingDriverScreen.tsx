import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRiderStore } from '../../store/useRiderStore';

export default function WaitingDriverScreen() {
  const navigation = useNavigation<any>();
  const { currentRide, setCurrentRide } = useRiderStore();

  // Polling temporário a cada 3s (depois substituímos por socket.io)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏳ Checking for driver...");

      // MOCK → simular um motorista aceitando após alguns ciclos
      if (currentRide && !currentRide.driver) {
        const randomAccept = Math.random() < 0.25; // 25% chance de aceitar

        if (randomAccept) {
          console.log("🚗 Driver accepted!");

          setCurrentRide({
            ...currentRide,
            status: 'accepted',
            driver: {
              id: 'driver-123',
              name: 'Carlos Semedo',
              rating: 4.9,
              photo: null,
            },
            driverVehicle: {
              model: 'Toyota Corolla',
              plate: 'ST-45-23',
              year: 2020,
            },
            acceptedAt: new Date().toISOString(),
          });

          navigation.navigate('DriverOnWay');
        }
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [currentRide]);


  if (!currentRide) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma corrida encontrada 😕</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1DB954" />

      <Text style={styles.title}>A procurar um motorista…</Text>
      <Text style={styles.subtitle}>
        Estamos a localizar o motorista mais próximo para ti.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Destino</Text>
        <Text style={styles.value}>
          {currentRide.destination.description}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Preço</Text>
        <Text style={styles.price}>{currentRide.estimatedPrice} CVE</Text>
      </View>

      <Text style={styles.info}>
        Isto pode demorar alguns segundos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    marginTop: 25,
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 10,
    width: '90%',
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
  info: {
    marginTop: 30,
    fontSize: 14,
    color: '#888',
  }
});
