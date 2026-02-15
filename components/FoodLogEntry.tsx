import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { FoodEntry } from '../hooks/useFoodLog';

interface FoodLogEntryProps {
  entry: FoodEntry;
}

export function FoodLogEntryCard({ entry }: FoodLogEntryProps) {
  const time = new Date(entry.date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{entry.name}</Text>
        <Text style={styles.cal}>{entry.calories} cal</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.macros}>
          P: {entry.protein}g · C: {entry.carbs}g · F: {entry.fat}g
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.calories,
  },
  macros: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 4,
  },
});
