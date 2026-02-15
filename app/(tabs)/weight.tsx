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
import { WeightChart } from '../../components/WeightChart';
import { useWeight } from '../../hooks/useWeight';

export default function WeightScreen() {
  const { entries, addEntry, todayLogged } = useWeight();
  const [weightInput, setWeightInput] = useState('');

  const handleAdd = async () => {
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid weight', 'Please enter a valid weight');
      return;
    }
    await addEntry(val);
    setWeightInput('');
  };

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {todayLogged ? 'Weight logged today!' : 'Log Weight'}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs)"
              placeholderTextColor={Colors.textDim}
              keyboardType="decimal-pad"
              value={weightInput}
              onChangeText={setWeightInput}
            />
            <Pressable style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Log</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Progress</Text>
        <View style={styles.chartWrap}>
          <WeightChart entries={entries} />
        </View>

        <Text style={styles.sectionTitle}>History</Text>
        {sorted.length === 0 ? (
          <Text style={styles.empty}>No weight entries yet</Text>
        ) : (
          sorted.map((e) => (
            <View key={e.id} style={styles.historyCard}>
              <Text style={styles.historyWeight}>{e.weight} lbs</Text>
              <Text style={styles.historyDate}>
                {new Date(e.date).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
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
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  addBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
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
  chartWrap: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 12,
    marginBottom: 20,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 8,
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyDate: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 20,
  },
});
