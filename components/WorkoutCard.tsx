import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Workout } from '../hooks/useWorkouts';

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const date = new Date(workout.date);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>🏋️</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.meta}>
          {workout.duration} min · {workout.calories} cal
        </Text>
      </View>
      <View style={styles.dateWrap}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.time}>{timeStr}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grassBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  meta: {
    fontSize: 13,
    color: Colors.gray600,
    marginTop: 2,
  },
  dateWrap: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: Colors.gray500,
  },
  time: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
});
