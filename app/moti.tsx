// PulsingCircle.tsx
import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import {type MotiProps} from './Types'

export default function Moti({
                                        size = 120,
                                        color = 'pink',
                                        scaleFrom = 0.9,
                                        scaleTo = 1.1,
                                        durationMs = 900,
                                        style,
                                      }: MotiProps) {
  return (
    <MotiView
      from={{ transform: [{ scale: scaleFrom }] }}
      animate={{ transform: [{ scale: scaleTo }] }}
      transition={{
        type: 'timing',
        duration: durationMs,
        loop: true,
        // yoyo makes it go back and forth (grow then shrink)
        // If you're on an older Moti, use: repeat: Infinity, repeatReverse: true
        repeatReverse: true,
        repeat: Infinity,
      }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}