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
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/colors';
import { WorkoutCard } from '../../components/WorkoutCard';
import { FoodResultCard } from '../../components/FoodResultCard';
import { FoodLogEntryCard } from '../../components/FoodLogEntry';
import { MacroBar } from '../../components/MacroBar';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useFoodLog } from '../../hooks/useFoodLog';

interface ScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

async function estimateCalories(name: string, duration?: number, reps?: number): Promise<number> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return 0;

  const detail = duration ? `${duration} minutes` : `${reps} reps`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Estimate calories burned doing "${name}" for ${detail}. Return ONLY a single integer number, nothing else.`,
        },
      ],
      max_tokens: 20,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '0';
  return parseInt(content, 10) || 0;
}

async function analyzeFood(base64: string): Promise<ScanResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Set EXPO_PUBLIC_OPENAI_API_KEY in your .env file.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this food image. Return ONLY a JSON object with: name (string), calories (number), protein (number in grams), carbs (number in grams), fat (number in grams). No markdown, no explanation.',
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64}` },
            },
          ],
        },
      ],
      max_tokens: 200,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return JSON.parse(content);
}

export default function WorkoutsScreen() {
  const {
    todayActivity,
    todayCalories,
    logExercise,
    updateActivity,
  } = useWorkouts();

  const { addEntry: addFoodEntry, todayEntries: todayFoodEntries, todayTotals: foodTotals } = useFoodLog();

  // Quick-log exercise form
  const [exName, setExName] = useState('');
  const [exMode, setExMode] = useState<'duration' | 'reps'>('duration');
  const [exValue, setExValue] = useState('');
  const [exCalories, setExCalories] = useState('');
  const [estimating, setEstimating] = useState(false);

  // Editing activity
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCalories, setEditCalories] = useState('');

  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [lastImageUri, setLastImageUri] = useState('');

  const netCaloriesToday = foodTotals.calories - todayCalories;

  const handleQuickLog = async () => {
    const name = exName.trim();
    if (!name) {
      Alert.alert('Missing info', 'Please enter an exercise name');
      return;
    }
    const value = parseInt(exValue, 10) || 0;
    if (value === 0) {
      Alert.alert('Missing info', `Please enter ${exMode === 'duration' ? 'duration' : 'reps'}`);
      return;
    }

    let calories = parseInt(exCalories, 10) || 0;
    const duration = exMode === 'duration' ? value : 0;
    const reps = exMode === 'reps' ? value : undefined;

    if (calories === 0) {
      setEstimating(true);
      try {
        calories = await estimateCalories(name, duration || undefined, reps);
      } catch {
        calories = 0;
      }
      setEstimating(false);
    }

    await logExercise(name, duration, calories, reps);
    setExName('');
    setExValue('');
    setExCalories('');
  };

  const handleSaveEdit = (activity: import('../../hooks/useWorkouts').ActivityLog) => {
    const newCal = parseInt(editCalories, 10);
    if (isNaN(newCal) || newCal < 0) {
      Alert.alert('Invalid', 'Enter a valid calorie number');
      return;
    }
    updateActivity({ ...activity, calories: newCal });
    setEditingId(null);
    setEditCalories('');
  };

  // --- Camera / Food scanning ---

  const openCamera = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }
      const pickerResult = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });

      if (pickerResult.canceled || !pickerResult.assets[0].base64) return;

      setScanning(true);
      setLastImageUri(pickerResult.assets[0].uri);

      const result = await analyzeFood(pickerResult.assets[0].base64);
      setScanResult(result);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to analyze food');
    } finally {
      setScanning(false);
    }
  };

  const handleLogFood = () => {
    if (!scanResult) return;
    addFoodEntry({ ...scanResult, imageUri: lastImageUri });
    setScanResult(null);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Section A: Today's Calories Banner */}
          <View style={styles.banner}>
            <Text style={styles.calNumber}>{netCaloriesToday}</Text>
            <Text style={styles.calLabel}>net calories today</Text>
            <View style={styles.bannerBreakdown}>
              <Text style={styles.breakdownText}>
                {foodTotals.calories} eaten  ·  {todayCalories} burned
              </Text>
            </View>
          </View>

          {/* Macros summary */}
          {todayFoodEntries.length > 0 && (
            <View style={styles.foodTotalsCard}>
              <Text style={styles.foodTotalsTitle}>Meals · {foodTotals.calories} cal</Text>
              <MacroBar protein={foodTotals.protein} carbs={foodTotals.carbs} fat={foodTotals.fat} />
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>P: {foodTotals.protein}g</Text>
                <Text style={styles.macroLabel}>C: {foodTotals.carbs}g</Text>
                <Text style={styles.macroLabel}>F: {foodTotals.fat}g</Text>
              </View>
            </View>
          )}

          {/* Scanning indicator */}
          {scanning && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.emerald} />
              <Text style={styles.loadingText}>Analyzing your food...</Text>
            </View>
          )}

          {/* Food scan result */}
          {scanResult && (
            <View style={styles.resultWrap}>
              <FoodResultCard
                result={scanResult}
                onLog={handleLogFood}
                onDismiss={() => setScanResult(null)}
              />
            </View>
          )}

          {/* Section B: Quick Log Exercise */}
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
              <View style={styles.toggleRow}>
                <Pressable
                  style={[styles.toggleBtn, exMode === 'duration' && styles.toggleActive]}
                  onPress={() => { setExMode('duration'); setExValue(''); }}
                >
                  <Text style={[styles.toggleText, exMode === 'duration' && styles.toggleTextActive]}>Duration</Text>
                </Pressable>
                <Pressable
                  style={[styles.toggleBtn, exMode === 'reps' && styles.toggleActive]}
                  onPress={() => { setExMode('reps'); setExValue(''); }}
                >
                  <Text style={[styles.toggleText, exMode === 'reps' && styles.toggleTextActive]}>Reps</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                placeholder={exMode === 'duration' ? 'Duration (min)' : 'Number of reps'}
                placeholderTextColor={Colors.textDim}
                keyboardType="numeric"
                value={exValue}
                onChangeText={setExValue}
              />
              <TextInput
                style={styles.input}
                placeholder="Calories (optional — auto-estimated if blank)"
                placeholderTextColor={Colors.textDim}
                keyboardType="numeric"
                value={exCalories}
                onChangeText={setExCalories}
              />
              <Pressable
                style={[styles.logBtn, estimating && styles.logBtnDisabled]}
                onPress={handleQuickLog}
                disabled={estimating}
              >
                {estimating ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.logBtnText}>Log Exercise</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Section D: Today's Activity */}
          <Text style={styles.sectionTitle}>Today's Activity</Text>

          {/* Food entries for today */}
          {todayFoodEntries.map((e) => (
            <FoodLogEntryCard key={e.id} entry={e} />
          ))}

          {/* Workout activity entries for today */}
          {todayActivity.map((a) => (
            <View key={a.id}>
              <Pressable onPress={() => { setEditingId(editingId === a.id ? null : a.id); setEditCalories(String(a.calories)); }}>
                <WorkoutCard
                  workout={{
                    id: a.id,
                    name: a.reps ? `${a.name} (${a.reps} reps)` : a.name,
                    duration: a.duration,
                    calories: a.calories,
                    date: a.date,
                  }}
                  activityType={a.type}
                />
              </Pressable>
              {editingId === a.id && (
                <View style={styles.editRow}>
                  <TextInput
                    style={[styles.input, styles.editInput]}
                    placeholder="Calories"
                    placeholderTextColor={Colors.textDim}
                    keyboardType="numeric"
                    value={editCalories}
                    onChangeText={setEditCalories}
                  />
                  <Pressable style={styles.editSaveBtn} onPress={() => handleSaveEdit(a)}>
                    <Text style={styles.editSaveBtnText}>Save</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))}

          {todayActivity.length === 0 && todayFoodEntries.length === 0 && (
            <Text style={styles.empty}>No activity logged today</Text>
          )}

          {/* Bottom spacer for FAB */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Camera Button */}
      <Pressable style={styles.fab} onPress={openCamera}>
        <FontAwesome name="camera" size={24} color={Colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  flex: {
    flex: 1,
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
  bannerBreakdown: {
    marginTop: 8,
  },
  breakdownText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  // Loading / scan result
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  resultWrap: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 12,
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
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
  },
  toggleActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  logBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  logBtnDisabled: {
    opacity: 0.6,
  },
  logBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
    marginTop: -4,
  },
  editInput: {
    flex: 1,
    marginBottom: 0,
  },
  editSaveBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  editSaveBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  // Food totals in activity
  foodTotalsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 10,
  },
  foodTotalsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.calories,
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  // Empty
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 16,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});
