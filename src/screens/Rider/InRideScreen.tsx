import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useRiderStore } from '../../stores/useRiderStore';
import {
  onDriverLocation,
  onRideStatus,
  connectRiderSocket,
  disconnectRiderSocket,
} from '../../services/socketRiderService';

/**
 * Badge de status reutilizável
 */
const RideStatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    in_progress: { label: 'Corrida em andamento', color: '#1E90FF' },
    completed: { label: 'Corrida concluída', color: '#6A5ACD' },
  };

  const data = status ? STATUS_CONFIG[status] : null;

  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: data?.color ?? '#999',
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>
        {data?.label ?? 'Estado'}
      </Text>
    </View>
  );
};

export default function InRideScreen() {
  const navigation = useNavigation<any>();
  const currentRide = useRiderStore((s) => s.currentRide);

  const [driverLocation, setDriverLocation] = useState<LatLng | null>(null);
  const mapRef = useRef<MapView | null>(null);

  /**
   * Conecta ao socket para:
   * - Atualizar localização do motorista
   * - Ouvir status da corrida
   */
  useEffect(() => {
    if (!currentRide) return;

    connectRiderSocket(currentRide.riderId);

    const unsubLoc = onDriverLocation(({ rideId, lat, lng }) => {
      if (rideId !== currentRide.id) return;

      const newLoc = { latitude: lat, longitude: lng };
      setDriverLocation(newLoc);

      // Ajusta o mapa dinamicamente
      mapRef.current?.fitToCoordinates(
        [
          newLoc,
          {
            latitude: currentRide.destination.coords.lat,
            longitude: currentRide.destination.coords.lng,
          },
        ],
        {
          edgePadding: { top: 80, right: 80, bottom: 300, left: 80 },
          animated: true,
        }
      );
    });

    const unsubStatus = onRideStatus(({ rideId, status }) => {
      if (rideId !== currentRide.id) return;

      if (status === 'completed') {
        navigation.navigate('RideCompleted');
      }
    });

    return () => {
      unsubLoc?.();
      unsubStatus?.();
      disconnectRiderSocket();
    };
  }, [currentRide]);

  if (!currentRide) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma corrida ativa…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentRide.origin.lat,
          longitude: currentRide.origin.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Destino */}
        <Marker
          coordinate={{
            latitude: currentRide.destination.coords.lat,
            longitude: currentRide.destination.coords.lng,
          }}
          title="Destino"
        />

        {/* Motorista */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            pinColor="green"
            title="Motorista"
          />
        )}

        {/* Rota motorista → destino */}
        {driverLocation && (
          <Polyline
            coordinates={[
              driverLocation,
              {
                latitude: currentRide.destination.coords.lat,
                longitude: currentRide.destination.coords.lng,
              },
            ]}
            strokeWidth={4}
            strokeColor="#1DB954"
          />
        )}
      </MapView>

      {/* PAINEL */}
      <View style={styles.panel}>
        <RideStatusBadge status={currentRide.status} />

        <Text style={styles.subtitle}>
          Destino: {currentRide.destination.address}
        </Text>

        {!driverLocation && (
          <ActivityIndicator size="small" color="#1DB954" />
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            Alert.alert(
              'Emergência',
              'Chamando serviços de emergência…'
            )
          }
        >
          <Text style={styles.btnText}>Emergência</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1 },
  map: { flex: 1 },
  panel: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  subtitle: { marginVertical: 6, fontSize: 16 },
  btn: {
    backgroundColor: '#d9534f',
    padding: 12,
    marginTop: 14,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
