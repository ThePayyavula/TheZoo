import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Panda } from '../../components/Panda';
import { AnimalPet } from '../../components/AnimalPet';
import { CoinDisplay } from '../../components/CoinDisplay';
import { useAppContext } from '../../contexts/AppContext';
import { PANDA_TYPES } from '../../constants/pandaTypes';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useFoodLog } from '../../hooks/useFoodLog';
import { useWeight } from '../../hooks/useWeight';
import { useQuests } from '../../hooks/useQuests';
import { useQuestCheck } from '../../hooks/useQuestCheck';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { coins, ownedPandas, dailyQuests } = useAppContext();
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

  const completedQuests = dailyQuests.filter((q) => q.completed).length;
  const totalQuests = dailyQuests.length;

  return (
    <LinearGradient
      colors={[Colors.gradientDark, Colors.gradientMid, Colors.gradientLight]}
      style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>The Zoo</Text>
        <View style={styles.headerRight}>
          <CoinDisplay coins={coins} />
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileBtn}>
            <FontAwesome name="user-circle" size={26} color={Colors.emerald} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <FontAwesome name="bolt" size={14} color={Colors.gold} />
          <Text style={styles.statValue}>{workoutToday}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <FontAwesome name="cutlery" size={14} color={Colors.carbs} />
          <Text style={styles.statValue}>{foodToday}</Text>
          <Text style={styles.statLabel}>Meals</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <FontAwesome name="star" size={14} color={Colors.xpPurple} />
          <Text style={styles.statValue}>{completedQuests}/{totalQuests}</Text>
          <Text style={styles.statLabel}>Quests</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <FontAwesome name="paw" size={14} color={Colors.emerald} />
          <Text style={styles.statValue}>{ownedPandas.length}</Text>
          <Text style={styles.statLabel}>Pets</Text>
        </View>
      </View>

      {/* Quest progress */}
      {totalQuests > 0 && (
        <View style={styles.xpBarWrap}>
          <View style={styles.xpBarRow}>
            <Text style={styles.xpLabel}>Quest Progress</Text>
            <Text style={styles.xpPercent}>{totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0}%</Text>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: totalQuests > 0 ? `${(completedQuests / totalQuests) * 100}%` : '0%' }]} />
          </View>
        </View>
      )}

      <View style={styles.grassland}>
        {ownedPandas.map((panda, i) => {
          const petType = PANDA_TYPES.find((t) => t.id === panda.typeId);
          return (
            <View
              key={panda.instanceId}
              style={[
                styles.pandaWrap,
                {
                  left: ((i * 110 + 30) % Math.max(width - 140, 1)),
                  top: 20 + (i % 4) * 90,
                },
              ]}>
              {petType?.animal ? (
                <AnimalPet animal={petType.animal} size={120} wandering />
              ) : (
                <Panda size={120} wandering />
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>Tap your pets to interact!</Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileBtn: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.emerald,
    textShadowColor: 'rgba(0, 230, 118, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.emeraldBorder,
  },
  xpBarWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 12,
  },
  xpBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xpPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.emerald,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.emerald,
    borderRadius: 4,
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
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
