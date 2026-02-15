import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface CoinDisplayProps {
  coins: number;
}

export function CoinDisplay({ coins }: CoinDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🪙</Text>
      <Text style={styles.amount}>{coins}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  icon: {
    fontSize: 18,
    marginRight: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gold,
  },
});
