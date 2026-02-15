import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_KEY = '@pandafit_food';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  imageUri?: string;
}

export function useFoodLog() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(FOOD_KEY).then((val) => {
      if (val !== null) setEntries(JSON.parse(val));
      setLoaded(true);
    });
  }, []);

  const addEntry = useCallback(async (entry: Omit<FoodEntry, 'id' | 'date'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setEntries((prev) => {
      const next = [newEntry, ...prev];
      AsyncStorage.setItem(FOOD_KEY, JSON.stringify(next));
      return next;
    });
    return newEntry;
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = entries.filter((e) => e.date.slice(0, 10) === today);
  const todayCount = todayEntries.length;

  const todayTotals = todayEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const weekCount = (() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return entries.filter((e) => new Date(e.date) >= weekAgo).length;
  })();

  return { entries, loaded, addEntry, todayEntries, todayCount, todayTotals, weekCount };
}
