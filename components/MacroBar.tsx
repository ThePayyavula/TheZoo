import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface MacroBarProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroBar({ protein, carbs, fat }: MacroBarProps) {
  const total = protein + carbs + fat || 1;
  const pPct = (protein / total) * 100;
  const cPct = (carbs / total) * 100;
  const fPct = (fat / total) * 100;

  return (
    <View style={styles.bar}>
      <View style={[styles.segment, { width: `${pPct}%`, backgroundColor: Colors.protein }]} />
      <View style={[styles.segment, { width: `${cPct}%`, backgroundColor: Colors.carbs }]} />
      <View style={[styles.segment, { width: `${fPct}%`, backgroundColor: Colors.fat }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.bgCardLight,
  },
  segment: {
    height: '100%',
  },
});
