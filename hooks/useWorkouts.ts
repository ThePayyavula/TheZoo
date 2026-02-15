import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUTS_KEY = '@pandafit_workouts';
const ROUTINES_KEY = '@pandafit_routines';
const ACTIVITY_LOG_KEY = '@pandafit_activity_log';

export interface Workout {
  id: string;
  name: string;
  duration: number; // minutes
  calories: number;
  date: string; // ISO date string
}

export interface ExerciseSet {
  reps: number;
  weight: number; // lbs, 0 for bodyweight
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface ActivityLog {
  id: string;
  type: 'routine' | 'exercise';
  name: string;
  calories: number;
  duration: number; // minutes
  date: string; // ISO
  routineId?: string; // if type === 'routine'
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(WORKOUTS_KEY),
      AsyncStorage.getItem(ROUTINES_KEY),
      AsyncStorage.getItem(ACTIVITY_LOG_KEY),
    ]).then(([workoutsVal, routinesVal, activityVal]) => {
      if (workoutsVal !== null) setWorkouts(JSON.parse(workoutsVal));
      if (routinesVal !== null) setRoutines(JSON.parse(routinesVal));
      if (activityVal !== null) setActivityLog(JSON.parse(activityVal));
      setLoaded(true);
    });
  }, []);

  // --- Legacy workout support (keeps quest system working) ---

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

  // --- Routines CRUD ---

  const addRoutine = useCallback(async (routine: Omit<Routine, 'id'>) => {
    const newRoutine: Routine = { ...routine, id: Date.now().toString() };
    setRoutines((prev) => {
      const next = [newRoutine, ...prev];
      AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(next));
      return next;
    });
    return newRoutine;
  }, []);

  const updateRoutine = useCallback(async (updated: Routine) => {
    setRoutines((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r));
      AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteRoutine = useCallback(async (id: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // --- Activity logging ---

  const addActivity = useCallback(async (entry: Omit<ActivityLog, 'id' | 'date'>) => {
    const newEntry: ActivityLog = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setActivityLog((prev) => {
      const next = [newEntry, ...prev];
      AsyncStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(next));
      return next;
    });
    return newEntry;
  }, []);

  const logRoutineCompletion = useCallback(async (routine: Routine, duration: number, calories: number) => {
    const entry = await addActivity({
      type: 'routine',
      name: routine.name,
      calories,
      duration,
      routineId: routine.id,
    });
    // Backward compat: also add as legacy workout so todayCount/weekCount stay accurate
    await addWorkout({ name: routine.name, duration, calories });
    return entry;
  }, [addActivity, addWorkout]);

  const logExercise = useCallback(async (name: string, duration: number, calories: number) => {
    const entry = await addActivity({
      type: 'exercise',
      name,
      calories,
      duration,
    });
    // Backward compat
    await addWorkout({ name, duration, calories });
    return entry;
  }, [addActivity, addWorkout]);

  // --- Derived data ---

  const todayStr = new Date().toISOString().slice(0, 10);

  const todayActivity = useMemo(
    () => activityLog.filter((a) => a.date.slice(0, 10) === todayStr),
    [activityLog, todayStr]
  );

  const todayCalories = useMemo(
    () => todayActivity.reduce((sum, a) => sum + a.calories, 0),
    [todayActivity]
  );

  return {
    workouts,
    loaded,
    addWorkout,
    todayCount,
    weekCount,
    // Routines
    routines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    // Activity
    activityLog,
    todayActivity,
    todayCalories,
    logRoutineCompletion,
    logExercise,
  };
}
