import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { QuestCard } from '../../components/QuestCard';
import { CoinDisplay } from '../../components/CoinDisplay';
import { useCoins } from '../../hooks/useCoins';
import { useQuests } from '../../hooks/useQuests';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useFoodLog } from '../../hooks/useFoodLog';
import { useWeight } from '../../hooks/useWeight';
import { useQuestCheck } from '../../hooks/useQuestCheck';

export default function QuestsScreen() {
  const { coins, addCoins } = useCoins();
  const { quests, getQuestProgress, claimQuest, updateProgress } = useQuests();
  const { todayCount: workoutToday, weekCount: workoutWeek } = useWorkouts();
  const { todayCount: foodToday, weekCount: foodWeek } = useFoodLog();
  const { todayLogged: weightToday, weekDaysLogged: weightWeek } = useWeight();

  useQuestCheck({
    updateProgress,
    workoutTodayCount: workoutToday,
    workoutWeekCount: workoutWeek,
    foodTodayCount: foodToday,
    foodWeekCount: foodWeek,
    weightTodayLogged: weightToday,
    weightWeekDays: weightWeek,
  });

  const handleClaim = async (questId: string) => {
    const reward = await claimQuest(questId);
    if (reward > 0) {
      addCoins(reward);
    }
  };

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.coinRow}>
        <CoinDisplay coins={coins} />
      </View>

      <Text style={styles.sectionTitle}>Daily Quests</Text>
      {dailyQuests.map((quest) => {
        const { progress, claimed } = getQuestProgress(quest.id);
        return (
          <QuestCard
            key={quest.id}
            quest={quest}
            progress={progress}
            claimed={claimed}
            onClaim={() => handleClaim(quest.id)}
          />
        );
      })}

      <Text style={styles.sectionTitle}>Weekly Quests</Text>
      {weeklyQuests.map((quest) => {
        const { progress, claimed } = getQuestProgress(quest.id);
        return (
          <QuestCard
            key={quest.id}
            quest={quest}
            progress={progress}
            claimed={claimed}
            onClaim={() => handleClaim(quest.id)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grassBg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  coinRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.grassDark,
    marginBottom: 12,
    marginTop: 8,
  },
});
