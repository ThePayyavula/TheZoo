export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  category: 'workout' | 'food' | 'weight' | 'general';
  target: number;
  coinReward: number;
  icon: string;
}

export const QUESTS: Quest[] = [
  {
    id: 'daily_workout_1',
    title: 'Get Moving',
    description: 'Log 1 workout today',
    type: 'daily',
    category: 'workout',
    target: 1,
    coinReward: 10,
    icon: '💪',
  },
  {
    id: 'daily_food_1',
    title: 'Meal Tracker',
    description: 'Log 1 meal today',
    type: 'daily',
    category: 'food',
    target: 1,
    coinReward: 10,
    icon: '🍎',
  },
  {
    id: 'daily_food_3',
    title: 'Full Day Tracker',
    description: 'Log 3 meals today',
    type: 'daily',
    category: 'food',
    target: 3,
    coinReward: 25,
    icon: '🥗',
  },
  {
    id: 'daily_weight',
    title: 'Scale Check',
    description: 'Log your weight today',
    type: 'daily',
    category: 'weight',
    target: 1,
    coinReward: 5,
    icon: '⚖️',
  },
  {
    id: 'weekly_workout_5',
    title: 'Workout Warrior',
    description: 'Log 5 workouts this week',
    type: 'weekly',
    category: 'workout',
    target: 5,
    coinReward: 50,
    icon: '🏆',
  },
  {
    id: 'weekly_food_15',
    title: 'Nutrition Master',
    description: 'Log 15 meals this week',
    type: 'weekly',
    category: 'food',
    target: 15,
    coinReward: 75,
    icon: '👨‍🍳',
  },
  {
    id: 'weekly_weight_3',
    title: 'Consistent Weigher',
    description: 'Log weight 3 days this week',
    type: 'weekly',
    category: 'weight',
    target: 3,
    coinReward: 30,
    icon: '📊',
  },
];
