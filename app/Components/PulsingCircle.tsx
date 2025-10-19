import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';

type Props = {
  size?: number;
  color?: string;
  scaleFrom?: number;
  scaleTo?: number;
  durationMs?: number;
  style?: ViewStyle;
};

export default function PulsingCircle({
  size = 120,
  color = 'pink',
  scaleFrom = 0.9,
  scaleTo = 1.1,
  durationMs = 900,
  style,
}: Props) {
  return (
    <MotiView
      from={{ transform: [{ scale: scaleFrom }] }}
      animate={{ transform: [{ scale: scaleTo }] }}
      transition={{ type: 'timing', duration: durationMs, loop: true, repeatReverse: true, repeat: Infinity }}
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}
    />
  );
}