import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';


const initialMessages = [{ id: '1', text: 'Olá, estou a caminho.', fromDriver: true }];


export default function DriverChatScreen() {
const [messages, setMessages] = useState(initialMessages);
const [text, setText] = useState('');


const send = () => {
if (!text.trim()) return;
const m = { id: String(Date.now()), text, fromDriver: true };
setMessages((s) => [m, ...s]);
setText('');
};


return (
<View style={styles.container}>
<FlatList
data={messages}
inverted
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={[styles.msg, item.fromDriver ? styles.right : styles.left]}>
<Text style={styles.msgText}>{item.text}</Text>
</View>
)}
contentContainerStyle={{ padding: 12 }}
/>


<View style={styles.inputRow}>
<TextInput
style={styles.input}
placeholder="Escreve uma mensagem..."
value={text}
onChangeText={setText}
/>
<TouchableOpacity style={styles.sendBtn} onPress={send}>
<Text style={{ color: '#fff' }}>Enviar</Text>
</TouchableOpacity>
</View>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1 },
msg: { padding: 10, borderRadius: 8, marginVertical: 6, maxWidth: '75%' },
left: { backgroundColor: '#eee', alignSelf: 'flex-start' },
right: { backgroundColor: '#1DB954', alignSelf: 'flex-end' },
msgText: { color: '#000' },
inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
input: { flex: 1, padding: 10, backgroundColor: '#fff', borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
sendBtn: { backgroundColor: '#222', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
});