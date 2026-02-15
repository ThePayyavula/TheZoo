import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { WorkoutCard } from '../../components/WorkoutCard';
import { RoutineCard } from '../../components/RoutineCard';
import { useWorkouts, Routine } from '../../hooks/useWorkouts';

export default function WorkoutsScreen() {
  const {
    routines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    todayActivity,
    todayCalories,
    logRoutineCompletion,
    logExercise,
  } = useWorkouts();

  // Quick-log exercise form
  const [exName, setExName] = useState('');
  const [exDuration, setExDuration] = useState('');
  const [exCalories, setExCalories] = useState('');

  // Add routine form
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');

  const handleQuickLog = async () => {
    if (!exName.trim()) {
      Alert.alert('Missing info', 'Please enter an exercise name');
      return;
    }
    await logExercise(
      exName.trim(),
      parseInt(exDuration, 10) || 0,
      parseInt(exCalories, 10) || 0
    );
    setExName('');
    setExDuration('');
    setExCalories('');
  };

  const handleAddRoutine = async () => {
    if (!newRoutineName.trim()) {
      Alert.alert('Missing info', 'Please enter a routine name');
      return;
    }
    await addRoutine({ name: newRoutineName.trim(), exercises: [] });
    setNewRoutineName('');
    setShowAddRoutine(false);
  };

  const handleStartRoutine = (routine: Routine) => {
    // Estimate: ~5 cal per exercise set, 2 min per set
    const totalSets = routine.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const estCalories = totalSets * 5;
    const estDuration = totalSets * 2;

    Alert.alert(
      'Complete Routine',
      `Log "${routine.name}" as completed?\n\nEstimate: ~${estDuration} min, ~${estCalories} cal\n\nYou can adjust values below.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log It',
          onPress: () => logRoutineCompletion(routine, estDuration, estCalories),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Section A: Today's Calories Banner */}
        <View style={styles.banner}>
          <Text style={styles.flameIcon}>Calories</Text>
          <Text style={styles.calNumber}>{todayCalories}</Text>
          <Text style={styles.calLabel}>calories burned today</Text>
        </View>

        {/* Section B: My Routines */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Routines</Text>
          <Pressable
            style={styles.addRoutineBtn}
            onPress={() => setShowAddRoutine(!showAddRoutine)}
          >
            <Text style={styles.addRoutineBtnText}>{showAddRoutine ? '\u2212' : '+'}</Text>
          </Pressable>
        </View>

        {showAddRoutine && (
          <View style={styles.addRoutineForm}>
            <TextInput
              style={styles.input}
              placeholder="Routine name (e.g., Push Day)"
              placeholderTextColor={Colors.textDim}
              value={newRoutineName}
              onChangeText={setNewRoutineName}
            />
            <Pressable style={styles.createBtn} onPress={handleAddRoutine}>
              <Text style={styles.createBtnText}>Create Routine</Text>
            </Pressable>
          </View>
        )}

        {routines.length === 0 && !showAddRoutine ? (
          <Text style={styles.empty}>Create your first routine</Text>
        ) : (
          routines.map((r) => (
            <RoutineCard
              key={r.id}
              routine={r}
              onStart={handleStartRoutine}
              onUpdate={updateRoutine}
              onDelete={deleteRoutine}
            />
          ))
        )}

        {/* Section C: Quick Log Exercise */}
        <View style={styles.quickLogSection}>
          <Text style={styles.sectionTitle}>Quick Log Exercise</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Exercise name (e.g., Running)"
              placeholderTextColor={Colors.textDim}
              value={exName}
              onChangeText={setExName}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Duration (min)"
                placeholderTextColor={Colors.textDim}
                keyboardType="numeric"
                value={exDuration}
                onChangeText={setExDuration}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Calories"
                placeholderTextColor={Colors.textDim}
                keyboardType="numeric"
                value={exCalories}
                onChangeText={setExCalories}
              />
            </View>
            <Pressable style={styles.logBtn} onPress={handleQuickLog}>
              <Text style={styles.logBtnText}>Log Exercise</Text>
            </Pressable>
          </View>
        </View>

        {/* Section D: Today's Activity */}
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        {todayActivity.length === 0 ? (
          <Text style={styles.empty}>No activity logged today</Text>
        ) : (
          todayActivity.map((a) => (
            <WorkoutCard
              key={a.id}
              workout={{
                id: a.id,
                name: a.name,
                duration: a.duration,
                calories: a.calories,
                date: a.date,
              }}
              activityType={a.type}
            />
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  // Banner
  banner: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  flameIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  calNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.emerald,
  },
  calLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 12,
  },
  addRoutineBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addRoutineBtnText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  // Add routine form
  addRoutineForm: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 12,
  },
  createBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  createBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  // Quick log
  quickLogSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  form: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 16,
  },
  input: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  logBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  logBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  // Empty
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 16,
  },
});
