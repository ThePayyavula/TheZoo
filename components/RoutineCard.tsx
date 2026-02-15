import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Routine, Exercise, ExerciseSet } from '../hooks/useWorkouts';

interface RoutineCardProps {
  routine: Routine;
  onStart: (routine: Routine) => void;
  onUpdate: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export function RoutineCard({ routine, onStart, onUpdate, onDelete }: RoutineCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('10');
  const [exWeight, setExWeight] = useState('0');

  const handleAddExercise = () => {
    if (!exName.trim()) {
      Alert.alert('Missing info', 'Enter an exercise name');
      return;
    }
    const setsCount = parseInt(exSets, 10) || 1;
    const reps = parseInt(exReps, 10) || 10;
    const weight = parseInt(exWeight, 10) || 0;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exName.trim(),
      sets: Array.from({ length: setsCount }, () => ({ reps, weight })),
    };

    onUpdate({ ...routine, exercises: [...routine.exercises, newExercise] });
    setExName('');
    setExSets('3');
    setExReps('10');
    setExWeight('0');
  };

  const handleRemoveExercise = (exerciseId: string) => {
    onUpdate({
      ...routine,
      exercises: routine.exercises.filter((e) => e.id !== exerciseId),
    });
  };

  const handleDelete = () => {
    Alert.alert('Delete Routine', `Delete "${routine.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(routine.id) },
    ]);
  };

  const formatSets = (sets: ExerciseSet[]) => {
    if (sets.length === 0) return '';
    const { reps, weight } = sets[0];
    const allSame = sets.every((s) => s.reps === reps && s.weight === weight);
    if (allSame) {
      return weight > 0
        ? `${sets.length}\u00D7${reps} @ ${weight} lbs`
        : `${sets.length}\u00D7${reps}`;
    }
    return sets.map((s) => (s.weight > 0 ? `${s.reps}@${s.weight}` : `${s.reps}`)).join(', ');
  };

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerLeft}>
          <Text style={styles.chevron}>{expanded ? '\u25BC' : '\u25B6'}</Text>
          <Text style={styles.routineName}>{routine.name}</Text>
          <Text style={styles.exerciseCount}>
            {routine.exercises.length} exercise{routine.exercises.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={() => { setExpanded(true); setEditing(!editing); }} hitSlop={8}>
            <Text style={styles.editIcon}>{editing ? '\u2713' : '\u270E'}</Text>
          </Pressable>
          <Pressable onPress={handleDelete} hitSlop={8}>
            <Text style={styles.deleteIcon}>\u2715</Text>
          </Pressable>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          {routine.exercises.length === 0 ? (
            <Text style={styles.emptyExercises}>No exercises yet. Tap edit to add some.</Text>
          ) : (
            routine.exercises.map((ex) => (
              <View key={ex.id} style={styles.exerciseRow}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <Text style={styles.exerciseSets}>{formatSets(ex.sets)}</Text>
                </View>
                {editing && (
                  <Pressable onPress={() => handleRemoveExercise(ex.id)} hitSlop={8}>
                    <Text style={styles.removeBtn}>\u2212</Text>
                  </Pressable>
                )}
              </View>
            ))
          )}

          {editing && (
            <View style={styles.addExForm}>
              <TextInput
                style={styles.input}
                placeholder="Exercise name"
                placeholderTextColor={Colors.textDim}
                value={exName}
                onChangeText={setExName}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Sets"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="numeric"
                  value={exSets}
                  onChangeText={setExSets}
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="Reps"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="numeric"
                  value={exReps}
                  onChangeText={setExReps}
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="lbs"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="numeric"
                  value={exWeight}
                  onChangeText={setExWeight}
                />
              </View>
              <Pressable style={styles.addExBtn} onPress={handleAddExercise}>
                <Text style={styles.addExBtnText}>+ Add Exercise</Text>
              </Pressable>
            </View>
          )}

          <Pressable
            style={[styles.startBtn, routine.exercises.length === 0 && styles.startBtnDisabled]}
            onPress={() => routine.exercises.length > 0 && onStart(routine)}
            disabled={routine.exercises.length === 0}
          >
            <Text style={styles.startBtnText}>Start Routine</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  chevron: {
    fontSize: 12,
    color: Colors.emerald,
  },
  routineName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  exerciseCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  editIcon: {
    fontSize: 16,
    color: Colors.emerald,
  },
  deleteIcon: {
    fontSize: 14,
    color: Colors.error,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  emptyExercises: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.emeraldBorder,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  exerciseSets: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  removeBtn: {
    fontSize: 20,
    color: Colors.error,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  addExForm: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  smallInput: {
    flex: 1,
  },
  addExBtn: {
    backgroundColor: Colors.emeraldGlow,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  addExBtnText: {
    color: Colors.emerald,
    fontSize: 14,
    fontWeight: '600',
  },
  startBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  startBtnDisabled: {
    opacity: 0.4,
  },
  startBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
