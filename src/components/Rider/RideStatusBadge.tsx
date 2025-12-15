import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RideStatus } from '../../types/ride';

type Props = {
  status: RideStatus;
};

const STATUS_CONFIG: Record<RideStatus, { label: string; color: string }> = {
  requested: {
    label: 'À procura de motorista',
    color: '#FACC15', // amarelo
  },
  accepted: {
    label: 'Motorista a caminho',
    color: '#3B82F6', // azul
  },
  in_progress: {
    label: 'Em viagem',
    color: '#22C55E', // verde
  },
  completed: {
    label: 'Concluída',
    color: '#9CA3AF', // cinza
  },
  cancelled: {
    label: 'Cancelada',
    color: '#EF4444', // vermelho
  },
};

export default function RideStatusBadge({ status }: Props) {
  const cfg = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.color }]}>
      <Text style={styles.text}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
