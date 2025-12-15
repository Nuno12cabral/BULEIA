import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';


export default function DriverSettingsScreen() {
return (
<View style={styles.container}>
<Text style={styles.title}>Configurações</Text>


<View style={styles.row}>
<Text>Notificações</Text>
<Switch value={true} onValueChange={() => alert('Toggle notifications')} />
</View>


<View style={styles.row}>
<Text>Modo Escuro</Text>
<Switch value={false} onValueChange={() => alert('Toggle dark mode')} />
</View>


<TouchableOpacity style={styles.logout} onPress={() => alert('Sair (implementar)')}>
<Text style={{ color: '#fff' }}>Sair</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, padding: 16 },
title: { fontSize: 20, fontWeight: '700', marginBottom: 24 },
row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
logout: { marginTop: 24, backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, alignItems: 'center' },
});