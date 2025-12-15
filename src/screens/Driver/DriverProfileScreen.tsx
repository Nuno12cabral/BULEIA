import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


export default function DriverProfileScreen() {
return (
<View style={styles.container}>
<Image source={{ uri: 'https://placehold.co/150x150' }} style={styles.avatar} />
<Text style={styles.name}>Nome do Motorista</Text>
<Text style={styles.info}>ID: 000123</Text>


<View style={styles.stats}>
<View style={styles.statItem}>
<Text style={styles.statValue}>4.9</Text>
<Text>Avaliação</Text>
</View>
<View style={styles.statItem}>
<Text style={styles.statValue}>1.234</Text>
<Text>Corridas</Text>
</View>
<View style={styles.statItem}>
<Text style={styles.statValue}>CV$ 12.345</Text>
<Text>Ganhos</Text>
</View>
</View>


<TouchableOpacity style={styles.btn} onPress={() => alert('Editar perfil')}>
<Text style={styles.btnText}>Editar Perfil</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, alignItems: 'center', paddingTop: 40 },
avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
name: { fontSize: 20, fontWeight: '700' },
info: { color: '#666', marginBottom: 20 },
stats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 24, marginBottom: 20 },
statItem: { alignItems: 'center' },
statValue: { fontWeight: '700', fontSize: 18 },
btn: { backgroundColor: '#222', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
btnText: { color: '#fff' },
});