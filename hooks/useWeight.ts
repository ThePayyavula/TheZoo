import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WEIGHT_KEY = '@pandafit_weight';

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export function useWeight() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(WEIGHT_KEY).then((val) => {
      if (val !== null) setEntries(JSON.parse(val));
      setLoaded(true);
    });
  }, []);

  const addEntry = useCallback(async (weight: number) => {
    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      weight,
      date: new Date().toISOString(),
    };
    setEntries((prev) => {
      const next = [newEntry, ...prev];
      AsyncStorage.setItem(WEIGHT_KEY, JSON.stringify(next));
      return next;
    });
    return newEntry;
  }, []);

  const updateEntry = useCallback(async (id: string, weight: number) => {
    setEntries((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, weight } : e));
      AsyncStorage.setItem(WEIGHT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(WEIGHT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayLogged = entries.some((e) => e.date.slice(0, 10) === today);

  const weekDaysLogged = (() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const days = new Set(
      entries
        .filter((e) => new Date(e.date) >= weekAgo)
        .map((e) => e.date.slice(0, 10))
    );
    return days.size;
  })();

  return { entries, loaded, addEntry, updateEntry, deleteEntry, todayLogged, weekDaysLogged };
}
