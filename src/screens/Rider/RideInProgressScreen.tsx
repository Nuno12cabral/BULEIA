// src/screens/Rider/RideInProgressScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  LatLng,
  AnimatedRegion,
} from 'react-native-maps';
import { useRiderStore } from '../../stores/useRiderStore';
import { useNavigation } from '@react-navigation/native';
import riderService from '../../services/riderService';
import {
  connectRiderSocket,
  disconnectRiderSocket,
  onDriverLocation,
  onRideStatus,
  onDriverAssigned,
} from '../../services/socketRiderService';
import { Ride } from '../../types/driver';

type DriverInfo = {
  id: string;
  name: string;
  phone?: string | null;
  vehicle?: { model?: string; plate?: string } | null;
  photo?: string | null;
  location?: { lat: number; lng: number } | null;
};

export default function RideInProgressScreen() {
  const navigation = useNavigation();
  const currentRide = useRiderStore((s) => s.currentRide);
  const [driver, setDriver] = useState<DriverInfo | null>(
    (currentRide as any)?.driver ?? null
  );
  const [driverCoord, setDriverCoord] = useState<LatLng | null>(
    driver?.location ? { latitude: driver.location.lat, longitude: driver.location.lng } : null
  );
  const [polyline, setPolyline] = useState<LatLng[] | null>(null);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(true);
  const mapRef = useRef<MapView | null>(null);

  // Animated marker region for smooth movement
  const animatedRegionRef = useRef<AnimatedRegion | null>(null);
  const animatedMarkerRef = useRef(new Animated.Value(0)).current;

  // Socket instance (managed inside socketRiderService)
  useEffect(() => {
    if (!currentRide) return;

    // Connect to rider socket and join ride room
    const sock = connectRiderSocket(useRiderStore.getState().profile?.id ?? 'guest');

    // Listen to assigned driver (might be redundant if currentRide already has driver)
    const assignedUnsub = onDriverAssigned((assignedRide: Ride) => {
      if (assignedRide.id === currentRide.id && assignedRide.driver) {
        setDriver({
          id: assignedRide.driver.id,
          name: assignedRide.driver.name,
          phone: assignedRide.driver.phone ?? null,
          vehicle: assignedRide.driver.vehicle ?? null,
          photo: assignedRide.driver.photo ?? null,
          location: assignedRide.driver.location ?? null,
        });
      }
    });

    // Driver live location updates
    const locUnsub = onDriverLocation((payload: { rideId: string; lat: number; lng: number }) => {
      if (payload.rideId !== currentRide.id) return;
      const coord = { latitude: payload.lat, longitude: payload.lng };
      setDriverCoord(coord);
      // animate marker
      animateMarkerTo(coord);
    });

    // Ride status updates (started, driver_arrived, completed, cancelled)
    const statusUnsub = onRideStatus((payload: { rideId: string; status: string; meta?: any }) => {
      if (payload.rideId !== currentRide.id) return;
      if (payload.status === 'in_progress') {
        // optionally update UI
      }
      if (payload.status === 'completed') {
        // Refresh ride, navigate to rating
        handleRideCompleted();
      }
      if (payload.status === 'cancelled') {
        Alert.alert('Corrida cancelada', 'O motorista cancelou a corrida.');
        useRiderStore.getState().setCurrentRide(null);
        navigation.navigate('Home' as never);
      }
    });

    // Try to compute route (polyline) using Directions API if API key configured
    (async () => {
      await computeRoutePolyline();
      setLoadingRoute(false);
    })();

    return () => {
      // cleanup listeners
      assignedUnsub?.();
      locUnsub?.();
      statusUnsub?.();
      disconnectRiderSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRide]);

  // Initialize animated region once we have a driver coordinate
  useEffect(() => {
    if (!driverCoord) return;
    if (!animatedRegionRef.current) {
      animatedRegionRef.current = new AnimatedRegion({
        latitude: driverCoord.latitude,
        longitude: driverCoord.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      } as any);
    } else {
      animateMarkerTo(driverCoord);
    }
  }, [driverCoord]);

  // Helper: attempt to fetch directions polyline from Google Directions API (if key set)
  async function computeRoutePolyline() {
    if (!currentRide) return;
    const origin = `${currentRide.origin.lat},${currentRide.origin.lng}`;
    const destination = `${currentRide.destination.lat},${currentRide.destination.lng}`;
    const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY; // set in env for production

    try {
      if (!key) throw new Error('No Directions API key set, using straight line fallback');

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}&mode=driving`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.routes && json.routes.length) {
        const points = decodePolyline(json.routes[0].overview_polyline.points);
        setPolyline(points);
        // fit to map
        setTimeout(() => fitMapToCoordinates(points), 300);
        return;
      } else {
        throw new Error('No routes returned');
      }
    } catch (err) {
      // fallback: straight line between pickup and destination
      setPolyline([
        { latitude: currentRide.origin.lat, longitude: currentRide.origin.lng },
        { latitude: currentRide.destination.lat, longitude: currentRide.destination.lng },
      ]);
      setTimeout(() =>
        fitMapToCoordinates([
          { latitude: currentRide.origin.lat, longitude: currentRide.origin.lng },
          { latitude: currentRide.destination.lat, longitude: currentRide.destination.lng },
        ]),
        300
      );
    }
  }

  // Fit map to coordinates helper
  function fitMapToCoordinates(coords: LatLng[]) {
    if (!mapRef.current || coords.length === 0) return;
    mapRef.current.fitToCoordinates(coords, { edgePadding: { top: 100, right: 60, bottom: 180, left: 60 }, animated: true });
  }

  // Animate marker to a new coordinate (smooth movement)
  function animateMarkerTo(coord: LatLng) {
    if (!animatedRegionRef.current) return;
    try {
      // AnimatedRegion.timing is not typed consistently — use (as any)
      (animatedRegionRef.current as any).timing({ ...coord, duration: 800 }).start();
    } catch (err) {
      // fallback: update state directly
      setDriverCoord(coord);
    }
  }

  // decodePolyline (Google polyline algorithm) -> LatLng[]
  function decodePolyline(encoded: string): LatLng[] {
    // standard polyline decoding implementation
    const points: LatLng[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += deltaLng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  }

  // When ride is completed server-side (status update)
  async function handleRideCompleted() {
    // refresh ride from backend to get final data
    try {
      if (!currentRide?.id) return;
      const fresh = await riderService.getRide(currentRide.id);
      useRiderStore.getState().setCurrentRide(fresh);
      // navigate to rating screen with ride id
      navigation.navigate('RideRating' as never, { rideId: fresh.id } as never);
    } catch (err) {
      console.log('Error fetching completed ride', err);
      navigation.navigate('Home' as never);
    }
  }

  // Manual complete button (usually driver triggers complete; rider only sees it when applicable)
  async function onPressComplete() {
    if (!currentRide?.id) return;
    try {
      await riderService.completeRide(currentRide.id);
      Alert.alert('Obrigado', 'Corrida marcada como concluída.');
      useRiderStore.getState().setCurrentRide(null);
      navigation.navigate('RideRating' as never, { rideId: currentRide.id } as never);
    } catch (err) {
      console.log('completeRide error', err);
      Alert.alert('Erro', 'Não foi possível finalizar a corrida. Tenta novamente.');
    }
  }

  // Call driver
  function callDriver() {
    if (!driver?.phone) return Alert.alert('Telefone indisponível');
    const tel = Platform.OS === 'ios' ? `telprompt:${driver.phone}` : `tel:${driver.phone}`;
    Linking.openURL(tel).catch(() => Alert.alert('Erro', 'Não foi possível iniciar a chamada.'));
  }

  // Chat action (placeholder — integrate chat screen)
  function openChat() {
    navigation.navigate('Chat' as never, { driverId: driver?.id } as never);
  }

  if (!currentRide) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma corrida em andamento.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home' as never)}>
          <Text style={styles.backBtnText}>Voltar à Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // center map initial region around pickup if polyline not ready
  const initialRegion = {
    latitude: currentRide.origin.lat,
    longitude: currentRide.origin.lng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={(r) => (mapRef.current = r)}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Pickup & Destination */}
        <Marker
          coordinate={{ latitude: currentRide.origin.lat, longitude: currentRide.origin.lng }}
          title="Origem"
        />
        <Marker
          coordinate={{ latitude: currentRide.destination.lat, longitude: currentRide.destination.lng }}
          title="Destino"
        />

        {/* Animated driver marker (if available) */}
        {animatedRegionRef.current && (
          <Marker.Animated
            ref={() => null}
            coordinate={animatedRegionRef.current}
            title={driver?.name ?? 'Motorista'}
          >
            <View style={styles.driverMarker}>
              <View style={styles.driverMarkerInner} />
            </View>
          </Marker.Animated>
        )}

        {/* Fallback static driver marker */}
        {!animatedRegionRef.current && driverCoord && (
          <Marker coordinate={driverCoord} title={driver?.name ?? 'Motorista'}>
            <View style={styles.driverMarker}>
              <View style={styles.driverMarkerInner} />
            </View>
          </Marker>
        )}

        {/* Polyline route */}
        {polyline && <Polyline coordinates={polyline} strokeColor="#1DB954" strokeWidth={4} />}
      </MapView>

      {/* Bottom card with driver info and actions */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={driver?.photo ? { uri: driver.photo } : require('../../assets/driver-placeholder.png')}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.driverName}>{driver?.name ?? 'Motorista'}</Text>
            <Text style={styles.vehicle}>
              {driver?.vehicle?.model ?? 'Veículo não informado'} • {driver?.vehicle?.plate ?? ''}
            </Text>
            <Text style={styles.eta}>
              {loadingRoute ? 'Calculando rota...' : `Distância aproximada: ${currentRide.distance ?? '—'} km`}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={callDriver}>
            <Text style={styles.actionTxt}>Ligar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={openChat}>
            <Text style={styles.actionTxt}>Mensagem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
            onPress={() =>
              Alert.alert('Emergência', 'Deseja contactar os serviços de emergência?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Ligar',
                  style: 'destructive',
                  onPress: () => {
                    const emergency = Platform.OS === 'ios' ? 'telprompt:112' : 'tel:112';
                    Linking.openURL(emergency).catch(() => {});
                  },
                },
              ])
            }
          >
            <Text style={styles.actionTxt}>Emergência</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 12 }}>
          <TouchableOpacity style={styles.completeBtn} onPress={onPressComplete}>
            <Text style={styles.completeTxt}>Concluir Corrida</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading overlay while computing route */}
      {loadingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={{ marginTop: 8 }}>Carregando rota...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  driverName: { fontSize: 16, fontWeight: '700' },
  vehicle: { color: '#666', marginTop: 2 },
  eta: { color: '#333', marginTop: 6, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionTxt: { fontWeight: '700' },
  completeBtn: { backgroundColor: '#1DB954', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  completeTxt: { color: '#fff', fontWeight: '700' },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    alignItems: 'center',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, marginBottom: 12 },
  backBtn: { backgroundColor: '#1DB954', padding: 12, borderRadius: 8 },
  backBtnText: { color: '#fff', fontWeight: '700' },
  driverMarker: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});
