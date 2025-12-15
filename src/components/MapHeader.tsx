import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function MapHeader({ title = 'Buleia' }: { title?: string }) {
return (
<View style={styles.header}>
<Text style={styles.title}>{title}</Text>
</View>
);
}


const styles = StyleSheet.create({
header: { position: 'absolute', top: 40, left: 16, right: 16, zIndex: 20 },
title: { backgroundColor: '#fff', padding: 8, borderRadius: 8, textAlign: 'center', fontWeight: '700' },
});