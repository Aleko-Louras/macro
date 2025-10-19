import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export interface MacroData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const Ring = ({ label, fill, color }: { label: string; fill: number; color: string }) => (
  <View style={{ alignItems: 'center', marginHorizontal: 8, marginVertical: 8 }}>
    <AnimatedCircularProgress
      size={90}
      width={10}
      fill={fill}
      tintColor={color}
      backgroundColor="#e6e6e6"
      rotation={0}
      lineCap="round">
      {() => <Text style={{ fontSize: 16, fontWeight: '600' }}>{Math.round(fill)}%</Text>}
    </AnimatedCircularProgress>
    <Text style={{ marginTop: 4 }}>{label}</Text>
  </View>
);

const pct = (goal: number, remaining: number) => (goal ? ((goal - remaining) / goal) * 100 : 0);

export default function MacroCircles({ goal, remaining }: { goal: MacroData | null; remaining: MacroData | null }) {
  if (!goal || !remaining) return null;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 }}>
      <Ring label="Cal"   fill={pct(goal.calories, remaining.calories)} color="#ff4081" />
      <Ring label="Carbs" fill={pct(goal.carbs,    remaining.carbs)}    color="#4caf50" />
      <Ring label="Prot"  fill={pct(goal.protein,  remaining.protein)}  color="#2196f3" />
      <Ring label="Fat"   fill={pct(goal.fat,      remaining.fat)}      color="#ffb300" />
    </View>
  );
}