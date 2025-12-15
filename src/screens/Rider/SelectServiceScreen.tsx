import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function SelectServiceScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { destination } = route.params;

  const services = [
    { id: 'taxi-economy', title: 'Económico', price: 300 },
    { id: 'taxi-confort', title: 'Confort', price: 450 },
    { id: 'taxi-premium', title: 'Premium', price: 700 },
    { id: 'hiace', title: 'Hiace (7-12 pax)', price: 1200 },
  ];

  const handleSelect = (service: any) => {
    navigation.navigate('ConfirmRide', {
      destination,
      serviceType: service.id,
      estimatedPrice: service.price,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o tipo de serviço</Text>

      {services.map((service) => (
        <TouchableOpacity 
          key={service.id} 
          style={styles.card}
          onPress={() => handleSelect(service)}
        >
          <Text style={styles.serviceName}>{service.title}</Text>
          <Text style={styles.price}>{service.price} CVE</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginBottom: 15,
  },
  serviceName: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 16, color: '#777', marginTop: 4 },
});
