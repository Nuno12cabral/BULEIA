import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useRiderStore } from "../../stores/useRiderStore";
import { RideStatus } from "../../types/ride";

/**
 * Badge visual do estado da corrida
 */
const RideStatusBadge: React.FC<{ status?: RideStatus }> = ({ status }) => {
  const STATUS_CONFIG: Record<
    RideStatus,
    { label: string; color: string }
  > = {
    requested: { label: "Corrida solicitada", color: "#999" },
    accepted: { label: "Motorista a caminho", color: "#1DB954" },
    in_progress: { label: "Em andamento", color: "#1E90FF" },
    completed: { label: "Corrida concluída", color: "#6A5ACD" },
    cancelled: { label: "Corrida cancelada", color: "#DC143C" },
  };

  const data = status ? STATUS_CONFIG[status] : null;

  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: data?.color ?? "#eee",
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 12,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
        {data?.label ?? "Estado desconhecido"}
      </Text>
    </View>
  );
};

export default function DriverOnWayScreen() {
  const navigation = useNavigation<any>();
  const { currentRide } = useRiderStore();

  const mapRef = useRef<MapView | null>(null);

  const [driverLocation, setDriverLocation] = useState({
    latitude: 16.8878,
    longitude: -24.9933,
  });

  /**
   * Mock de movimento do motorista
   * (REMOVER quando socket estiver ativo)
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        latitude: prev.latitude + 0.0005,
        longitude: prev.longitude + 0.0005,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!currentRide) {
    return (
      <View style={styles.center}>
        <Text>Nenhuma corrida ativa…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={driverLocation} title="Motorista" pinColor="green" />

        <Marker
          coordinate={{
            latitude: currentRide.destination.coords.lat,
            longitude: currentRide.destination.coords.lng,
          }}
          title="Destino"
        />

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
      </MapView>

      <View style={styles.panel}>
        <RideStatusBadge status={currentRide.status} />

        <Text style={styles.label}>
          Motorista: {currentRide.driver?.name}
        </Text>
        <Text style={styles.label}>
          Veículo: {currentRide.driverVehicle?.model}
        </Text>
        <Text style={styles.label}>
          Matrícula: {currentRide.driverVehicle?.plate}
        </Text>

        {!driverLocation && (
          <ActivityIndicator size="small" color="#1DB954" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  map: { flex: 1 },
  panel: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  label: { fontSize: 16, marginBottom: 4 },
});
