import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Quest } from '../constants/quests';

interface QuestCardProps {
  quest: Quest;
  progress: number;
  claimed: boolean;
  onClaim: () => void;
}

export function QuestCard({ quest, progress, claimed, onClaim }: QuestCardProps) {
  const isComplete = progress >= quest.target;
  const progressPct = Math.min(progress / quest.target, 1);

  return (
    <View style={[styles.card, claimed && styles.cardClaimed]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{quest.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.title}>{quest.title}</Text>
          <Text style={styles.desc}>{quest.description}</Text>
        </View>
        <View style={styles.reward}>
          <Text style={styles.rewardText}>🪙 {quest.coinReward}</Text>
        </View>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          {Math.min(progress, quest.target)}/{quest.target}
        </Text>
        {claimed ? (
          <Text style={styles.claimedText}>Claimed!</Text>
        ) : isComplete ? (
          <Pressable style={styles.claimBtn} onPress={onClaim}>
            <Text style={styles.claimBtnText}>Claim</Text>
          </Pressable>
        ) : (
          <Text style={styles.typeBadge}>{quest.type}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardClaimed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  desc: {
    fontSize: 13,
    color: Colors.gray600,
    marginTop: 2,
  },
  reward: {
    backgroundColor: Colors.grassBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBg: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.grassLight,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    color: Colors.gray600,
    fontWeight: '600',
  },
  claimBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  claimBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  claimedText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
  },
  typeBadge: {
    fontSize: 12,
    color: Colors.gray500,
    textTransform: 'capitalize',
  },
});
