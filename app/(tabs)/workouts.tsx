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
import { useWorkouts } from '../../hooks/useWorkouts';

export default function WorkoutsScreen() {
  const { workouts, addWorkout } = useWorkouts();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCals] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Missing info', 'Please enter a workout name');
      return;
    }
    await addWorkout({
      name: name.trim(),
      duration: parseInt(duration, 10) || 0,
      calories: parseInt(calories, 10) || 0,
    });
    setName('');
    setDuration('');
    setCals('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Log Workout</Text>
          <TextInput
            style={styles.input}
            placeholder="Workout name (e.g., Running)"
            placeholderTextColor={Colors.textDim}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Duration (min)"
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Calories"
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              value={calories}
              onChangeText={setCals}
            />
          </View>
          <Pressable style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Add Workout</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>History</Text>
        {workouts.length === 0 ? (
          <Text style={styles.empty}>No workouts yet. Start logging!</Text>
        ) : (
          workouts.map((w) => <WorkoutCard key={w.id} workout={w} />)
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
  form: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 12,
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
  addBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 20,
  },
});
