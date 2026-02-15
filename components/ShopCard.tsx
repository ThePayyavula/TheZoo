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
  onRemove?: () => void;
}

export function ShopCard({ panda, ownedCount, onBuy, onRemove }: ShopCardProps) {
  const previewGif = panda.animal
    ? getAnimalWalkGif(panda.animal)
    : require('../assets/pandas/Gifs/Idle.gif');

  return (
    <View style={styles.card}>
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
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.buyBtn} onPress={onBuy} activeOpacity={0.7}>
          <Text style={styles.buyText}>{panda.price} coins</Text>
        </TouchableOpacity>
        {ownedCount > 0 && onRemove && (
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove} activeOpacity={0.7}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  btnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  buyBtn: {
    flex: 1,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  removeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
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
