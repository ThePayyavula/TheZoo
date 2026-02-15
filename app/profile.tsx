import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useAppContext } from '../contexts/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, bmi, profileSummary, generateAIQuests, questsLoading } = useAppContext();

  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<'cut' | 'bulk'>('cut');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setCurrentWeight(String(profile.currentWeight));
      setTargetWeight(String(profile.targetWeight));
      setHeightFeet(String(profile.heightFeet));
      setHeightInches(String(profile.heightInches));
      setFitnessGoal(profile.fitnessGoal);
      setSaved(true);
    }
  }, [profile]);

  const handleSave = async () => {
    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const hf = parseInt(heightFeet, 10);
    const hi = parseInt(heightInches, 10);

    if (isNaN(cw) || isNaN(tw) || isNaN(hf) || isNaN(hi)) {
      Alert.alert('Missing info', 'Please fill in all fields with valid numbers.');
      return;
    }
    if (cw <= 0 || tw <= 0 || hf < 0 || hi < 0) {
      Alert.alert('Invalid values', 'Please enter positive numbers.');
      return;
    }

    await saveProfile({
      currentWeight: cw,
      targetWeight: tw,
      heightFeet: hf,
      heightInches: hi,
      fitnessGoal,
    });
    setSaved(true);
  };

  const handleGenerateQuests = async () => {
    await generateAIQuests();
    Alert.alert('Quests Generated!', 'Your personalized daily quests are ready. Check the Quests tab!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile Dashboard</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Stats</Text>

          <Text style={styles.label}>Current Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 180"
            placeholderTextColor={Colors.textDim}
            keyboardType="decimal-pad"
            value={currentWeight}
            onChangeText={setCurrentWeight}
          />

          <Text style={styles.label}>Target Weight (lbs)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 165"
            placeholderTextColor={Colors.textDim}
            keyboardType="decimal-pad"
            value={targetWeight}
            onChangeText={setTargetWeight}
          />

          <Text style={styles.label}>Height</Text>
          <View style={styles.heightRow}>
            <TextInput
              style={[styles.input, styles.heightInput]}
              placeholder="Feet"
              placeholderTextColor={Colors.textDim}
              keyboardType="number-pad"
              value={heightFeet}
              onChangeText={setHeightFeet}
            />
            <Text style={styles.heightSep}>ft</Text>
            <TextInput
              style={[styles.input, styles.heightInput]}
              placeholder="Inches"
              placeholderTextColor={Colors.textDim}
              keyboardType="number-pad"
              value={heightInches}
              onChangeText={setHeightInches}
            />
            <Text style={styles.heightSep}>in</Text>
          </View>

          <Text style={styles.label}>Fitness Goal</Text>
          <View style={styles.goalRow}>
            <TouchableOpacity
              style={[styles.goalBtn, fitnessGoal === 'cut' && styles.goalBtnActive]}
              onPress={() => setFitnessGoal('cut')}>
              <Text style={[styles.goalBtnText, fitnessGoal === 'cut' && styles.goalBtnTextActive]}>
                Cut
              </Text>
              <Text style={styles.goalDesc}>Lose fat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.goalBtn, fitnessGoal === 'bulk' && styles.goalBtnActive]}
              onPress={() => setFitnessGoal('bulk')}>
              <Text style={[styles.goalBtnText, fitnessGoal === 'bulk' && styles.goalBtnTextActive]}>
                Bulk
              </Text>
              <Text style={styles.goalDesc}>Gain muscle</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </TouchableOpacity>
        </View>

        {saved && profile && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Profile</Text>

            <View style={styles.statRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{bmi.toFixed(1)}</Text>
                <Text style={styles.statLabel}>BMI</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.currentWeight}</Text>
                <Text style={styles.statLabel}>Current lbs</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{profile.targetWeight}</Text>
                <Text style={styles.statLabel}>Target lbs</Text>
              </View>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{profileSummary}</Text>
            </View>

            <TouchableOpacity
              style={[styles.generateBtn, questsLoading && styles.generateBtnDisabled]}
              onPress={handleGenerateQuests}
              disabled={questsLoading}>
              {questsLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={Colors.white} />
                  <Text style={styles.generateBtnText}> Generating...</Text>
                </View>
              ) : (
                <Text style={styles.generateBtnText}>Generate AI Quests</Text>
              )}
            </TouchableOpacity>
          </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.emerald,
  },
  closeBtn: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  closeBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  heightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heightInput: {
    flex: 1,
  },
  heightSep: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  goalBtn: {
    flex: 1,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalBtnActive: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.emeraldGlow,
  },
  goalBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  goalBtnTextActive: {
    color: Colors.emerald,
  },
  goalDesc: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.emerald,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  summaryBox: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  generateBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateBtnDisabled: {
    opacity: 0.7,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
