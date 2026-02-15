import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/colors';
import { PandaType } from '../constants/pandaTypes';
import { getAnimalWalkGif } from './AnimalPet';

interface ShopCardProps {
  panda: PandaType;
  ownedCount: number;
  onBuy: () => void;
}

export function ShopCard({ panda, ownedCount, onBuy }: ShopCardProps) {
  const previewGif = panda.animal
    ? getAnimalWalkGif(panda.animal)
    : require('../assets/pandas/Gifs/Idle.gif');

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onBuy}>
      <View style={[styles.imageWrap, panda.tint ? { backgroundColor: panda.tint, borderRadius: 40 } : undefined]}>
        <Image
          source={previewGif}
          style={styles.image}
          contentFit="contain"
        />
      </View>
      <Text style={styles.name}>{panda.name}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {panda.description}
      </Text>
      {ownedCount > 0 && (
        <Text style={styles.ownedText}>Owned: {ownedCount}</Text>
      )}
      <View style={styles.buyBtn}>
        <Text style={styles.buyText}>{panda.price} coins</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    padding: 12,
    margin: 6,
    alignItems: 'center',
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
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  desc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  buyBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  buyText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  ownedText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.emerald,
    marginBottom: 4,
  },
});
