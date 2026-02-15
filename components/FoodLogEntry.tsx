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
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  cal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.calories,
  },
  macros: {
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 4,
  },
});
