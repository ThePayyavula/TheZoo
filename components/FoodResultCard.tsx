import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { MacroBar } from './MacroBar';

interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodResultCardProps {
  result: FoodResult;
  onLog: () => void;
  onDismiss: () => void;
}

export function FoodResultCard({ result, onLog, onDismiss }: FoodResultCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{result.name}</Text>
      <Text style={styles.calories}>{result.calories} calories</Text>
      <MacroBar protein={result.protein} carbs={result.carbs} fat={result.fat} />
      <View style={styles.macros}>
        <View style={styles.macroItem}>
          <View style={[styles.dot, { backgroundColor: Colors.protein }]} />
          <Text style={styles.macroText}>Protein: {result.protein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <View style={[styles.dot, { backgroundColor: Colors.carbs }]} />
          <Text style={styles.macroText}>Carbs: {result.carbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <View style={[styles.dot, { backgroundColor: Colors.fat }]} />
          <Text style={styles.macroText}>Fat: {result.fat}g</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </Pressable>
        <Pressable style={styles.logBtn} onPress={onLog}>
          <Text style={styles.logText}>Log Meal</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  calories: {
    fontSize: 16,
    color: Colors.calories,
    fontWeight: '600',
    marginBottom: 16,
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  macroText: {
    fontSize: 13,
    color: Colors.gray700,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray300,
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 15,
    color: Colors.gray600,
    fontWeight: '600',
  },
  logBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.grassLight,
    alignItems: 'center',
  },
  logText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
  },
});
