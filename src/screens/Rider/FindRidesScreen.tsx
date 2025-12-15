import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDriverStore } from '../../stores/useDriverStore';
import { fetchAvailableRides } from '../../services/driverService';
import { useNavigation } from '@react-navigation/native';

export default function FindRidesScreen() {
  const navigation = useNavigation();
  const { availableRides, setAvailableRides } = useDriverStore();

  useEffect(() => {
    const load = async () => {
      const rides = await fetchAvailableRides();
      setAvailableRides(rides);
    };
    load();
  }, []);

  const handleSelectRide = (ride: any) => {
    navigation.navigate('AcceptRide', { ride });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Corridas Disponíveis</Text>

      <FlatList
        data={availableRides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectRide(item)}>
            <Text style={styles.cardTitle}>{item.rider.name}</Text>
            <Text>Origem: {item.pickup.address}</Text>
            <Text>Destino: {item.destination.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhuma corrida no momento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
});
