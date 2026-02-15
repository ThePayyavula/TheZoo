import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUESTS, Quest } from '../constants/quests';

const QUEST_STATE_KEY = '@pandafit_quest_state';
const QUEST_RESET_KEY = '@pandafit_quest_reset';

export interface QuestState {
  [questId: string]: {
    progress: number;
    claimed: boolean;
  };
}

function getResetKey(type: 'daily' | 'weekly'): string {
  const now = new Date();
  if (type === 'daily') return now.toISOString().slice(0, 10);
  // weekly: use the Monday of the current week
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return `week_${monday.toISOString().slice(0, 10)}`;
}

export function useQuests() {
  const [state, setState] = useState<QuestState>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    const [stateStr, resetStr] = await Promise.all([
      AsyncStorage.getItem(QUEST_STATE_KEY),
      AsyncStorage.getItem(QUEST_RESET_KEY),
    ]);

    const savedState: QuestState = stateStr ? JSON.parse(stateStr) : {};
    const savedReset: Record<string, string> = resetStr ? JSON.parse(resetStr) : {};

    const dailyKey = getResetKey('daily');
    const weeklyKey = getResetKey('weekly');

    let needsReset = false;
    const newState = { ...savedState };

    // Reset daily quests if day changed
    if (savedReset.daily !== dailyKey) {
      QUESTS.filter((q) => q.type === 'daily').forEach((q) => {
        newState[q.id] = { progress: 0, claimed: false };
      });
      needsReset = true;
    }

    // Reset weekly quests if week changed
    if (savedReset.weekly !== weeklyKey) {
      QUESTS.filter((q) => q.type === 'weekly').forEach((q) => {
        newState[q.id] = { progress: 0, claimed: false };
      });
      needsReset = true;
    }

    if (needsReset) {
      await AsyncStorage.setItem(QUEST_STATE_KEY, JSON.stringify(newState));
      await AsyncStorage.setItem(
        QUEST_RESET_KEY,
        JSON.stringify({ daily: dailyKey, weekly: weeklyKey })
      );
    }

    setState(newState);
    setLoaded(true);
  };

  const updateProgress = useCallback(
    async (questId: string, progress: number) => {
      setState((prev) => {
        const current = prev[questId] || { progress: 0, claimed: false };
        const next = {
          ...prev,
          [questId]: { ...current, progress: Math.max(current.progress, progress) },
        };
        AsyncStorage.setItem(QUEST_STATE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const claimQuest = useCallback(async (questId: string): Promise<number> => {
    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) return 0;

    return new Promise((resolve) => {
      setState((prev) => {
        const current = prev[questId] || { progress: 0, claimed: false };
        if (current.claimed || current.progress < quest.target) {
          resolve(0);
          return prev;
        }
        const next = {
          ...prev,
          [questId]: { ...current, claimed: true },
        };
        AsyncStorage.setItem(QUEST_STATE_KEY, JSON.stringify(next));
        resolve(quest.coinReward);
        return next;
      });
    });
  }, []);

  const getQuestProgress = useCallback(
    (questId: string) => {
      return state[questId] || { progress: 0, claimed: false };
    },
    [state]
  );

  return { state, loaded, updateProgress, claimQuest, getQuestProgress, quests: QUESTS };
}
