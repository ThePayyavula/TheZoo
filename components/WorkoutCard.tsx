import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Workout } from '../hooks/useWorkouts';

interface WorkoutCardProps {
  workout: Workout;
  activityType?: 'routine' | 'exercise';
}

export function WorkoutCard({ workout, activityType }: WorkoutCardProps) {
  const date = new Date(workout.date);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{activityType === 'routine' ? '\uD83D\uDCCB' : '\uD83C\uDFCB\uFE0F'}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{workout.name}</Text>
          {activityType && (
            <View style={[styles.badge, activityType === 'routine' ? styles.badgeRoutine : styles.badgeExercise]}>
              <Text style={styles.badgeText}>
                {activityType === 'routine' ? 'Routine' : 'Exercise'}
              </Text>
            </View>
          )}
        </View>
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
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCardLight,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeRoutine: {
    backgroundColor: Colors.emeraldGlow,
  },
  badgeExercise: {
    backgroundColor: 'rgba(249, 168, 37, 0.12)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.emerald,
  },
  meta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dateWrap: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  time: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 2,
  },
});
