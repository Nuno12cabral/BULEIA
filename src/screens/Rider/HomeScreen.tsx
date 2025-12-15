import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location';
import UberButton from '../../components/UberButton';


export default function HomeScreen({ navigation }: { navigation: any }) {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
        >
          <Marker coordinate={location} title="Você" />
        </MapView>
      ) : (
        <Text>Carregando mapa...</Text>
      )}

      <View style={styles.box}>
        <UberButton title="Para onde vamos?" onPress={() => navigation.navigate('SelectDestination')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  box: { position: 'absolute', bottom: 20, left: 20, right: 20 }
});
