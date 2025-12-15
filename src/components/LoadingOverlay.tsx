import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';


export default function LoadingOverlay({ message = 'A carregar...' }: { message?: string }) {
return (
<View style={styles.container} pointerEvents="none">
<View style={styles.box}>
<ActivityIndicator size="large" />
<Text style={{ marginTop: 8 }}>{message}</Text>
</View>
</View>
);
}


const styles = StyleSheet.create({
container: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
box: { padding: 16, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' },
});