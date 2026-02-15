import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/colors';
import { PandaType } from '../constants/pandaTypes';

interface ShopCardProps {
  panda: PandaType;
  owned: boolean;
  onBuy: () => void;
}

export function ShopCard({ panda, owned, onBuy }: ShopCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.imageWrap, panda.tint ? { backgroundColor: panda.tint, borderRadius: 40 } : undefined]}>
        <Image
          source={require('../assets/pandas/Gifs/Idle.gif')}
          style={styles.image}
          contentFit="contain"
        />
      </View>
      <Text style={styles.name}>{panda.name}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {panda.description}
      </Text>
      {owned ? (
        <View style={styles.ownedBadge}>
          <Text style={styles.ownedText}>Owned</Text>
        </View>
      ) : (
        <Pressable style={styles.buyBtn} onPress={onBuy}>
          <Text style={styles.buyText}>🪙 {panda.price}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  desc: {
    fontSize: 11,
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  buyBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  buyText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  ownedBadge: {
    backgroundColor: Colors.grassBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ownedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.grassDark,
  },
});
