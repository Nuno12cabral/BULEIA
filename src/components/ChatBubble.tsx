import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function ChatBubble({ text, right }: { text: string; right?: boolean }) {
return (
<View style={[styles.bubble, right ? styles.right : styles.left]}>
<Text style={styles.text}>{text}</Text>
</View>
);
}


const styles = StyleSheet.create({
bubble: { padding: 10, borderRadius: 8, marginVertical: 6, maxWidth: '80%' },
left: { backgroundColor: '#eee', alignSelf: 'flex-start' },
right: { backgroundColor: '#1DB954', alignSelf: 'flex-end' },
text: { color: '#000' },
});