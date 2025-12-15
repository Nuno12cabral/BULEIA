import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

type Props = {
  value: number;                 // rating atual (1–5)
  onChange: (v: number) => void; // callback controlado
  size?: number;
  disabled?: boolean;
};

export default function RatingStars({
  value,
  onChange,
  size = 36,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          disabled={disabled}
          onPress={() => onChange(star)}
        >
          <Text
            style={[
              styles.star,
              { fontSize: size },
              value >= star && styles.active,
              disabled && styles.disabled,
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#bbb',
    marginHorizontal: 6,
  },
  active: {
    color: '#FFD700',
  },
  disabled: {
    opacity: 0.5,
  },
});
