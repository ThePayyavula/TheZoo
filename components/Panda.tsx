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

const GIF_IDLE = require('../assets/pandas/Gifs/Idle.gif');
const GIF_WALK = require('../assets/pandas/Gifs/Walk.gif');

const DANCE_GIFS = [
  require('../assets/pandas/Gifs/Roll.gif'),
  require('../assets/pandas/Gifs/RightHook.gif'),
  require('../assets/pandas/Gifs/LeftJab.gif'),
  require('../assets/pandas/Gifs/RightLeftCombo.gif'),
  require('../assets/pandas/Gifs/Throw.gif'),
  require('../assets/pandas/Gifs/JumpFallLand.gif'),
];

interface PandaProps {
  size?: number;
  wandering?: boolean;
  tint?: string;
}

export function Panda({ size = 120, wandering = false }: PandaProps) {
  const [state, setState] = useState<'idle' | 'walk' | 'dance'>('idle');
  const [danceGif, setDanceGif] = useState(DANCE_GIFS[0]);
  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const danceTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!wandering) return;

    const interval = setInterval(() => {
      if (state === 'dance') return;

      const shouldWalk = Math.random() > 0.4;
      if (shouldWalk) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        scaleX.value = direction > 0 ? 1 : -1;
        const next = translateX.value + direction * (40 + Math.random() * 60);
        const clamped = Math.max(-80, Math.min(80, next));
        translateX.value = withTiming(clamped, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        });
        setState('walk');
        setTimeout(() => setState('idle'), 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [wandering, state]);

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDanceGif(DANCE_GIFS[Math.floor(Math.random() * DANCE_GIFS.length)]);
    setState('dance');
    if (danceTimer.current) clearTimeout(danceTimer.current);
    danceTimer.current = setTimeout(() => setState('idle'), 2000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scaleX: scaleX.value },
    ],
  }));

  const currentGif = state === 'idle' ? GIF_IDLE : state === 'walk' ? GIF_WALK : danceGif;

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
