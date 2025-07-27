import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';

export function HelloWave() {
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4 // Run the animation 4 times
    );
  }, [rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <ThemedText style={styles.emoji}>👋</ThemedText>
      </Animated.View>
      <ThemedText style={styles.greeting}>안녕하세요!</ThemedText>
      <ThemedText style={styles.subtitle}>환영합니다</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
});
