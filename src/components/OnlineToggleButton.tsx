import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDriverStore } from '../stores/useDriverStore';


export default function OnlineToggleButton() {
const online = useDriverStore((s) => s.online);
const setOnline = useDriverStore((s) => s.setOnline);


return (
<TouchableOpacity
style={[styles.btn, online ? styles.online : styles.offline]}
onPress={() => setOnline(!online)}
>
<Text style={styles.txt}>{online ? 'Online' : 'Offline'}</Text>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999 },
online: { backgroundColor: '#1DB954' },
offline: { backgroundColor: '#ccc' },
txt: { color: '#fff', fontWeight: '700' },
});