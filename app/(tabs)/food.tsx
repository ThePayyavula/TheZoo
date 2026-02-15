import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/colors';
import { FoodResultCard } from '../../components/FoodResultCard';
import { FoodLogEntryCard } from '../../components/FoodLogEntry';
import { MacroBar } from '../../components/MacroBar';
import { useFoodLog } from '../../hooks/useFoodLog';

interface ScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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

export default function FoodScreen() {
  const { addEntry, todayEntries, todayTotals } = useFoodLog();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [lastImageUri, setLastImageUri] = useState<string>('');

  const pickImage = async (useCamera: boolean) => {
    try {
      let pickerResult;
      if (useCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission needed', 'Camera permission is required');
          return;
        }
        pickerResult = await ImagePicker.launchCameraAsync({
          base64: true,
          quality: 0.5,
        });
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          base64: true,
          quality: 0.5,
        });
      }

      if (pickerResult.canceled || !pickerResult.assets[0].base64) return;

      setScanning(true);
      setLastImageUri(pickerResult.assets[0].uri);

      const scanResult = await analyzeFood(pickerResult.assets[0].base64);
      setResult(scanResult);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to analyze food');
    } finally {
      setScanning(false);
    }
  };

  const handleLog = () => {
    if (!result) return;
    addEntry({
      ...result,
      imageUri: lastImageUri,
    });
    setResult(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.scanSection}>
        <Text style={styles.sectionTitle}>Scan Food</Text>
        <View style={styles.btnRow}>
          <Pressable style={styles.scanBtn} onPress={() => pickImage(true)}>
            <Text style={styles.scanBtnIcon}>📷</Text>
            <Text style={styles.scanBtnText}>Camera</Text>
          </Pressable>
          <Pressable style={styles.scanBtn} onPress={() => pickImage(false)}>
            <Text style={styles.scanBtnIcon}>🖼️</Text>
            <Text style={styles.scanBtnText}>Gallery</Text>
          </Pressable>
        </View>
      </View>

      {scanning && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.emerald} />
          <Text style={styles.loadingText}>Analyzing your food...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultWrap}>
          <FoodResultCard
            result={result}
            onLog={handleLog}
            onDismiss={() => setResult(null)}
          />
        </View>
      )}

      <Text style={styles.sectionTitle}>Today's Log</Text>
      {todayEntries.length > 0 && (
        <View style={styles.totals}>
          <Text style={styles.totalCal}>{todayTotals.calories} cal total</Text>
          <MacroBar
            protein={todayTotals.protein}
            carbs={todayTotals.carbs}
            fat={todayTotals.fat}
          />
          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>P: {todayTotals.protein}g</Text>
            <Text style={styles.macroLabel}>C: {todayTotals.carbs}g</Text>
            <Text style={styles.macroLabel}>F: {todayTotals.fat}g</Text>
          </View>
        </View>
      )}

      {todayEntries.length === 0 ? (
        <Text style={styles.empty}>No meals logged today. Scan something!</Text>
      ) : (
        todayEntries.map((e) => <FoodLogEntryCard key={e.id} entry={e} />)
      )}
    </ScrollView>
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
  scanSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.emerald,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scanBtn: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 20,
    alignItems: 'center',
  },
  scanBtnIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  scanBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  resultWrap: {
    marginBottom: 20,
  },
  totals: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    marginBottom: 12,
  },
  totalCal: {
    fontSize: 16,
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
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 20,
  },
});
