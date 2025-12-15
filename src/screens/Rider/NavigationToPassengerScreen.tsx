import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDriverStore } from '../../stores/useDriverStore';
import { useNavigation } from '@react-navigation/native';

export default function NavigationToPassengerScreen() {
  const navigation = useNavigation();
  const ride = useDriverStore((s) => s.currentRide);

  if (!ride) return <Text>Nenhuma corrida selecionada.</Text>;

  const handleArrived = () => {
    navigation.navigate('StartRide');
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: ride.pickup.latitude,
          longitude: ride.pickup.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={ride.pickup} title="Passageiro" />
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.info}>A caminho do passageiro...</Text>
        <TouchableOpacity style={styles.button} onPress={handleArrived}>
          <Text style={styles.buttonText}>Cheguei ao local</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: { padding: 16, backgroundColor: '#fff' },
  info: { fontSize: 16, marginBottom: 10 },
  button: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
