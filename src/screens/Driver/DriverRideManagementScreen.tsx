import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ride } from '../../types/ride';

type DriverMode = 'idle' | 'active';

export default function DriverRideManagementScreen() {
  const [mode, setMode] = useState<DriverMode>('idle');
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  /* ---------------- MOCK DATA (remover quando backend entrar) ---------------- */
  useEffect(() => {
    if (mode === 'idle') {
      setAvailableRides([
        {
          id: 'ride-001',
          customer: { id: 'c1', name: 'João Silva' },
          serviceType: 'taxi-economy',
          origin: {
            address: 'Plateau',
            coords: { lat: 14.917, lng: -23.509 },
          },
          destination: {
            address: 'Achada Santo António',
            coords: { lat: 14.93, lng: -23.51 },
          },
          estimatedPrice: 450,
          currency: 'CVE',
          status: 'requested',
          requestedAt: new Date().toISOString(),
          distance: 4.2,
          duration: 12,
        } as Ride,
      ]);
    }
  }, [mode]);
  /* -------------------------------------------------------------------------- */

  function acceptRide(ride: Ride) {
    Alert.alert(
      'Aceitar corrida?',
      `Passageiro: ${ride.customer.name}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          onPress: () => {
            setActiveRide({
              ...ride,
              status: 'accepted',
              acceptedAt: new Date().toISOString(),
            });
            setMode('active');
          },
        },
      ]
    );
  }

  function startRide() {
    if (!activeRide) return;
    setActiveRide({
      ...activeRide,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    });
  }

  function finishRide() {
    if (!activeRide) return;
    Alert.alert('Corrida finalizada');
    setActiveRide(null);
    setMode('idle');
  }

  /* =========================== RENDER =========================== */

  if (mode === 'active' && activeRide) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Corrida Ativa</Text>

        <Text style={styles.label}>
          Passageiro: {activeRide.customer.name}
        </Text>
        <Text style={styles.label}>
          Origem: {activeRide.origin.address}
        </Text>
        <Text style={styles.label}>
          Destino: {activeRide.destination.address}
        </Text>
        <Text style={styles.label}>
          Valor: {activeRide.estimatedPrice} {activeRide.currency}
        </Text>

        {activeRide.status === 'accepted' && (
          <TouchableOpacity style={styles.primaryBtn} onPress={startRide}>
            <Text style={styles.btnText}>Iniciar Corrida</Text>
          </TouchableOpacity>
        )}

        {activeRide.status === 'in_progress' && (
          <TouchableOpacity style={styles.primaryBtn} onPress={finishRide}>
            <Text style={styles.btnText}>Finalizar Corrida</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  /* =========================== IDLE =========================== */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitações Disponíveis</Text>

      <FlatList
        data={availableRides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.customer.name}</Text>
            <Text>Origem: {item.origin.address}</Text>
            <Text>Destino: {item.destination.address}</Text>
            <Text>Distância: {item.distance} km</Text>
            <Text>Valor: {item.estimatedPrice} {item.currency}</Text>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => acceptRide(item)}
            >
              <Text style={styles.acceptText}>Aceitar Corrida</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* =========================== STYLES =========================== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },

  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },

  acceptBtn: {
    marginTop: 12,
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: { color: '#fff', fontWeight: '600' },

  label: { fontSize: 16, marginBottom: 6 },

  primaryBtn: {
    marginTop: 20,
    backgroundColor: '#1DB954',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
