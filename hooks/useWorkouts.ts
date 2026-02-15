import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUTS_KEY = '@pandafit_workouts';

export interface Workout {
  id: string;
  name: string;
  duration: number; // minutes
  calories: number;
  date: string; // ISO date string
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(WORKOUTS_KEY).then((val) => {
      if (val !== null) setWorkouts(JSON.parse(val));
      setLoaded(true);
    });
  }, []);

  const addWorkout = useCallback(async (workout: Omit<Workout, 'id' | 'date'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setWorkouts((prev) => {
      const next = [newWorkout, ...prev];
      AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(next));
      return next;
    });
    return newWorkout;
  }, []);

  const todayCount = workouts.filter(
    (w) => w.date.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ).length;

  const weekCount = (() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workouts.filter((w) => new Date(w.date) >= weekAgo).length;
  })();

  return { workouts, loaded, addWorkout, todayCount, weekCount };
}
