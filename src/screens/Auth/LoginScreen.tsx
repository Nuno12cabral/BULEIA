import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import UberButton from '../../components/UberButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />

      <UberButton title="Entrar" onPress={() => navigation.replace('Home')} />
      <UberButton title="Criar conta" onPress={() => navigation.navigate('Register')} style={{ backgroundColor: '#eee' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  input: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 10 }
});
