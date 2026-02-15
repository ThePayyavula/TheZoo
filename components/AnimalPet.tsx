import React, { useState, useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Asset maps for each animal: walk + sleep gifs
const ANIMAL_ASSETS: Record<string, { walk: any; sleep: any }> = {
  dog: {
    walk: require('../assets/Dog/Dog_walk.gif'),
    sleep: require('../assets/Dog/dog_sleep.gif'),
  },
  lion: {
    walk: require('../assets/Lion/lion_walk.gif'),
    sleep: require('../assets/Lion/lion_sleep.gif'),
  },
  parrot: {
    walk: require('../assets/Parrot/parrot_walk.gif'),
    sleep: require('../assets/Parrot/parrot_sleep.gif'),
  },
  penguin: {
    walk: require('../assets/Penguin/penguin_walk.gif'),
    sleep: require('../assets/Penguin/penguin_sleep.gif'),
  },
  snow_fox: {
    walk: require('../assets/Snow_fox/snowfox_walk.gif'),
    sleep: require('../assets/Snow_fox/snowfox_sleep.gif'),
  },
  trex: {
    walk: require('../assets/T-rex/trex_walk.gif'),
    sleep: require('../assets/T-rex/trex_sleep.gif'),
  },
  wolf: {
    walk: require('../assets/Wolf/wolf_walk.gif'),
    sleep: require('../assets/Wolf/wolf_sleep.gif'),
  },
  gorilla: {
    walk: require('../assets/gorilla/gorilla_walk.gif'),
    sleep: require('../assets/gorilla/gorilla_sleep.gif'),
  },
};

interface AnimalPetProps {
  animal: string;
  size?: number;
  wandering?: boolean;
}

export function AnimalPet({ animal, size = 120, wandering = false }: AnimalPetProps) {
  const assets = ANIMAL_ASSETS[animal];
  const [state, setState] = useState<'walk' | 'sleep'>('walk');
  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const tapLock = useRef(false);

  useEffect(() => {
    if (!wandering) return;

    const interval = setInterval(() => {
      if (state === 'sleep') return;

      const shouldMove = Math.random() > 0.4;
      if (shouldMove) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        scaleX.value = direction > 0 ? 1 : -1;
        const next = translateX.value + direction * (40 + Math.random() * 60);
        const clamped = Math.max(-80, Math.min(80, next));
        translateX.value = withTiming(clamped, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [wandering, state]);

  const handleTap = () => {
    if (tapLock.current) return;
    tapLock.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setState((prev) => (prev === 'walk' ? 'sleep' : 'walk'));
    setTimeout(() => { tapLock.current = false; }, 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: scaleX.value },
    ],
  }));

  if (!assets) return null;

  const currentGif = state === 'walk' ? assets.walk : assets.sleep;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handleTap}>
        <Image
          source={currentGif}
          style={{ width: size, height: size }}
          contentFit="contain"
        />
      </Pressable>
    </Animated.View>
  );
}

/** Get the walk gif for shop preview */
export function getAnimalWalkGif(animal: string) {
  return ANIMAL_ASSETS[animal]?.walk ?? null;
}
