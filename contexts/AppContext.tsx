import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COINS_KEY = '@pandafit_coins';
const PANDAS_KEY = '@pandafit_pandas';
const PROFILE_KEY = '@pandafit_profile';
const AI_QUESTS_KEY = '@pandafit_ai_quests';
const AI_QUESTS_DATE_KEY = '@pandafit_ai_quests_date';

// ── Types ──

export interface OwnedPanda {
  instanceId: string;
  typeId: string;
}

export interface UserProfile {
  currentWeight: number;
  targetWeight: number;
  heightFeet: number;
  heightInches: number;
  fitnessGoal: 'cut' | 'bulk';
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  isCustom: boolean;
}

function calculateBMI(weightLbs: number, heightFeet: number, heightInches: number): number {
  const totalInches = heightFeet * 12 + heightInches;
  if (totalInches === 0) return 0;
  return (weightLbs / (totalInches * totalInches)) * 703;
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function generateProfileSummary(profile: UserProfile, bmi: number): string {
  const bmiCat = getBMICategory(bmi);
  const weightDiff = Math.abs(profile.currentWeight - profile.targetWeight);
  const direction = profile.fitnessGoal === 'cut' ? 'lose' : 'gain';
  const level = weightDiff <= 10 ? 'near your goal' : weightDiff <= 25 ? 'intermediate progress needed' : 'significant journey ahead';

  return `BMI: ${bmi.toFixed(1)} (${bmiCat}). Goal: ${profile.fitnessGoal === 'cut' ? 'Cutting' : 'Bulking'} — ${direction} ${weightDiff} lbs. Status: ${level}. Current: ${profile.currentWeight} lbs, Target: ${profile.targetWeight} lbs, Height: ${profile.heightFeet}'${profile.heightInches}".`;
}

// ── Context ──

interface AppContextType {
  // Coins
  coins: number;
  addCoins: (amount: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  // Pandas
  ownedPandas: OwnedPanda[];
  addPanda: (typeId: string) => Promise<void>;
  countOfType: (typeId: string) => number;
  // Profile
  profile: UserProfile | null;
  saveProfile: (profile: UserProfile) => Promise<void>;
  bmi: number;
  profileSummary: string;
  // AI Quests
  dailyQuests: DailyQuest[];
  toggleQuest: (id: string) => void;
  editQuest: (id: string, title: string, description: string) => void;
  deleteQuest: (id: string) => void;
  addCustomQuest: (title: string, description: string) => void;
  generateAIQuests: () => Promise<void>;
  questsLoading: boolean;
  // General
  loaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(200);
  const coinsRef = useRef(200);
  const [ownedPandas, setOwnedPandas] = useState<OwnedPanda[]>([
    { instanceId: 'classic_0', typeId: 'classic' },
  ]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [questsLoading, setQuestsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const bmi = profile ? calculateBMI(profile.currentWeight, profile.heightFeet, profile.heightInches) : 0;
  const profileSummary = profile ? generateProfileSummary(profile, bmi) : '';

  // ── Load from storage ──
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(COINS_KEY),
      AsyncStorage.getItem(PANDAS_KEY),
      AsyncStorage.getItem(PROFILE_KEY),
      AsyncStorage.getItem(AI_QUESTS_KEY),
      AsyncStorage.getItem(AI_QUESTS_DATE_KEY),
    ]).then(([coinsVal, pandasVal, profileVal, questsVal, questsDateVal]) => {
      if (coinsVal !== null) {
        const parsed = parseInt(coinsVal, 10);
        setCoins(parsed);
        coinsRef.current = parsed;
      } else {
        AsyncStorage.setItem(COINS_KEY, '200');
      }
      if (pandasVal !== null) {
        setOwnedPandas(JSON.parse(pandasVal));
      } else {
        const defaultPandas = [{ instanceId: 'classic_0', typeId: 'classic' }];
        AsyncStorage.setItem(PANDAS_KEY, JSON.stringify(defaultPandas));
      }
      if (profileVal !== null) {
        setProfile(JSON.parse(profileVal));
      }
      // Load quests only if they're from today
      const today = new Date().toISOString().slice(0, 10);
      if (questsVal !== null && questsDateVal === today) {
        setDailyQuests(JSON.parse(questsVal));
      }
      setLoaded(true);
    });
  }, []);

  // ── Persist quests on change ──
  const persistQuests = useCallback((quests: DailyQuest[]) => {
    const today = new Date().toISOString().slice(0, 10);
    AsyncStorage.setItem(AI_QUESTS_KEY, JSON.stringify(quests));
    AsyncStorage.setItem(AI_QUESTS_DATE_KEY, today);
  }, []);

  // ── Coins ──
  const addCoins = useCallback(async (amount: number) => {
    const next = coinsRef.current + amount;
    coinsRef.current = next;
    setCoins(next);
    await AsyncStorage.setItem(COINS_KEY, String(next));
  }, []);

  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (coinsRef.current < amount) return false;
    const next = coinsRef.current - amount;
    coinsRef.current = next;
    setCoins(next);
    await AsyncStorage.setItem(COINS_KEY, String(next));
    return true;
  }, []);

  // ── Pandas ──
  const addPanda = useCallback(async (typeId: string) => {
    const instanceId = `${typeId}_${Date.now()}`;
    const newPanda = { instanceId, typeId };
    setOwnedPandas((prev) => {
      const next = [...prev, newPanda];
      AsyncStorage.setItem(PANDAS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const countOfType = useCallback(
    (typeId: string) => ownedPandas.filter((p) => p.typeId === typeId).length,
    [ownedPandas]
  );

  // ── Profile ──
  const saveProfile = useCallback(async (p: UserProfile) => {
    setProfile(p);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }, []);

  // ── AI Quests ──
  const generateAIQuests = useCallback(async () => {
    if (!profile) return;
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) return;

    setQuestsLoading(true);
    try {
      const currentBmi = calculateBMI(profile.currentWeight, profile.heightFeet, profile.heightInches);
      const prompt = `You are a fitness coach AI. Generate exactly 6 personalized daily fitness quests for this user:
- Current weight: ${profile.currentWeight} lbs
- Target weight: ${profile.targetWeight} lbs
- Height: ${profile.heightFeet}'${profile.heightInches}"
- BMI: ${currentBmi.toFixed(1)}
- Goal: ${profile.fitnessGoal === 'cut' ? 'Cutting (lose fat)' : 'Bulking (gain muscle)'}

Each quest should be realistic, measurable, and actionable. Mix workout, nutrition, hydration, and lifestyle quests.

Return ONLY a JSON array with objects having "title" (short, 3-6 words) and "description" (1 sentence, specific and measurable). No markdown.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '[]';
      const parsed: { title: string; description: string }[] = JSON.parse(content);

      const newQuests: DailyQuest[] = parsed.map((q, i) => ({
        id: `ai_${Date.now()}_${i}`,
        title: q.title,
        description: q.description,
        completed: false,
        isCustom: false,
      }));

      setDailyQuests(newQuests);
      persistQuests(newQuests);
    } catch (err) {
      console.error('Failed to generate AI quests:', err);
    } finally {
      setQuestsLoading(false);
    }
  }, [profile, persistQuests]);

  const toggleQuest = useCallback((id: string) => {
    setDailyQuests((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q));
      persistQuests(next);
      return next;
    });
  }, [persistQuests]);

  const editQuest = useCallback((id: string, title: string, description: string) => {
    setDailyQuests((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, title, description } : q));
      persistQuests(next);
      return next;
    });
  }, [persistQuests]);

  const deleteQuest = useCallback((id: string) => {
    setDailyQuests((prev) => {
      const next = prev.filter((q) => q.id !== id);
      persistQuests(next);
      return next;
    });
  }, [persistQuests]);

  const addCustomQuest = useCallback((title: string, description: string) => {
    setDailyQuests((prev) => {
      const next = [
        ...prev,
        {
          id: `custom_${Date.now()}`,
          title,
          description,
          completed: false,
          isCustom: true,
        },
      ];
      persistQuests(next);
      return next;
    });
  }, [persistQuests]);

  return (
    <AppContext.Provider
      value={{
        coins, addCoins, spendCoins,
        ownedPandas, addPanda, countOfType,
        profile, saveProfile, bmi, profileSummary,
        dailyQuests, toggleQuest, editQuest, deleteQuest, addCustomQuest, generateAIQuests, questsLoading,
        loaded,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
