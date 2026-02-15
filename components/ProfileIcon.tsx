import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';

export function ProfileIcon() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/profile')}
      activeOpacity={0.7}>
      <FontAwesome name="user-circle" size={26} color={Colors.emerald} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    padding: 4,
  },
});
