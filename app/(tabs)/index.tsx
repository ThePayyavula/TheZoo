import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Panda } from '../../components/Panda';
import { CoinDisplay } from '../../components/CoinDisplay';
import { useCoins } from '../../hooks/useCoins';
import { usePandas } from '../../hooks/usePandas';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useFoodLog } from '../../hooks/useFoodLog';
import { useWeight } from '../../hooks/useWeight';
import { useQuests } from '../../hooks/useQuests';
import { useQuestCheck } from '../../hooks/useQuestCheck';
import { PANDA_TYPES } from '../../constants/pandaTypes';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { coins } = useCoins();
  const { ownedPandas } = usePandas();
  const { todayCount: workoutToday, weekCount: workoutWeek } = useWorkouts();
  const { todayCount: foodToday, weekCount: foodWeek } = useFoodLog();
  const { todayLogged: weightToday, weekDaysLogged: weightWeek } = useWeight();
  const { updateProgress } = useQuests();

  useQuestCheck({
    updateProgress,
    workoutTodayCount: workoutToday,
    workoutWeekCount: workoutWeek,
    foodTodayCount: foodToday,
    foodWeekCount: foodWeek,
    weightTodayLogged: weightToday,
    weightWeekDays: weightWeek,
  });

  const pandaDefs = ownedPandas
    .map((id) => PANDA_TYPES.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <LinearGradient
      colors={[Colors.grassLight, Colors.meadow, Colors.bamboo]}
      style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>PandaFit</Text>
        <CoinDisplay coins={coins} />
      </View>

      <View style={styles.grassland}>
        {pandaDefs.map((panda, i) => (
          <View
            key={panda!.id}
            style={[
              styles.pandaWrap,
              {
                left: ((i * 120 + 40) % (width - 140)),
                top: 60 + (i % 3) * 80,
              },
            ]}>
            <Panda size={120} wandering />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>Tap a panda to make it dance!</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  grassland: {
    flex: 1,
    position: 'relative',
  },
  pandaWrap: {
    position: 'absolute',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  hint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
});
