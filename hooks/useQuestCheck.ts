import { useEffect } from 'react';

interface QuestCheckParams {
  updateProgress: (questId: string, progress: number) => void;
  workoutTodayCount: number;
  workoutWeekCount: number;
  foodTodayCount: number;
  foodWeekCount: number;
  weightTodayLogged: boolean;
  weightWeekDays: number;
}

export function useQuestCheck({
  updateProgress,
  workoutTodayCount,
  workoutWeekCount,
  foodTodayCount,
  foodWeekCount,
  weightTodayLogged,
  weightWeekDays,
}: QuestCheckParams) {
  useEffect(() => {
    // Daily workout quests
    updateProgress('daily_workout_1', workoutTodayCount);

    // Daily food quests
    updateProgress('daily_food_1', foodTodayCount);
    updateProgress('daily_food_3', foodTodayCount);

    // Daily weight quest
    updateProgress('daily_weight', weightTodayLogged ? 1 : 0);

    // Weekly quests
    updateProgress('weekly_workout_5', workoutWeekCount);
    updateProgress('weekly_food_15', foodWeekCount);
    updateProgress('weekly_weight_3', weightWeekDays);
  }, [
    workoutTodayCount,
    workoutWeekCount,
    foodTodayCount,
    foodWeekCount,
    weightTodayLogged,
    weightWeekDays,
    updateProgress,
  ]);
}
