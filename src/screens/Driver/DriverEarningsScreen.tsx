import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';


const sampleData = [
{ id: '1', date: '2025-11-01', amount: 'CV$ 1.200' },
{ id: '2', date: '2025-11-02', amount: 'CV$ 900' },
{ id: '3', date: '2025-11-03', amount: 'CV$ 1300' },
];


export default function DriverEarningsScreen() {
return (
<View style={styles.container}>
<Text style={styles.title}>Ganhos</Text>
<Text style={styles.total}>Total este mês: CV$ 3.400</Text>


<FlatList
data={sampleData}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.item}>
<Text>{item.date}</Text>
<Text style={{ fontWeight: '700' }}>{item.amount}</Text>
</View>
)}
/>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, padding: 16 },
title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
total: { fontSize: 16, marginBottom: 12 },
item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
});