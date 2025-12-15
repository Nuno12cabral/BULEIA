import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import UberButton from '../../components/UberButton';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export default function RegisterScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <UberButton title="Registrar" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 }
});