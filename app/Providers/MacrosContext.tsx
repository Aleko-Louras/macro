import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MacroData = { calories:number; protein:number; carbs:number; fat:number };
export type EatenEntry = { name: string; macros: MacroData };
type PersistedDay = { goal: MacroData; remaining: MacroData; date: string };

type Ctx = {
  // global state
  startOfDay: boolean;
  goal: MacroData | null;
  remaining: MacroData | null;
  eaten: EatenEntry[];

  // actions
  setDailyGoal: (g: MacroData) => Promise<void>;
  addFood: (entry: EatenEntry) => Promise<void>;

  // utils
  rehydrate: () => Promise<void>;
};

const MacrosCtx = createContext<Ctx | null>(null);

const KEYS = { DAY: 'Macros', EATEN: 'Eaten' } as const;

const today = (): string => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

async function loadDay(): Promise<PersistedDay | null> {
  const raw = await AsyncStorage.getItem(KEYS.DAY);
  return raw ? (JSON.parse(raw) as PersistedDay) : null;
}
async function saveDay(day: PersistedDay) {
  await AsyncStorage.setItem(KEYS.DAY, JSON.stringify(day));
}
async function loadEaten(): Promise<EatenEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.EATEN);
  return raw ? (JSON.parse(raw) as EatenEntry[]) : [];
}
async function saveEaten(list: EatenEntry[]) {
  await AsyncStorage.setItem(KEYS.EATEN, JSON.stringify(list));
}

export default function MacrosProvider({ children }: { children: React.ReactNode }) {
  const [startOfDay, setStartOfDay] = useState(true);
  const [goal, setGoal] = useState<MacroData | null>(null);
  const [remaining, setRemaining] = useState<MacroData | null>(null);
  const [eaten, setEaten] = useState<EatenEntry[]>([]);

  // --- hydrate on mount
  useEffect(() => {
    rehydrate();
    // rollover check whenever app comes to foreground
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active') await ensureRollover();
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureRollover = async () => {
    const saved = await loadDay();
    if (!saved) return;
    if (saved.date !== today()) {
      const fresh: PersistedDay = { goal: saved.goal, remaining: saved.goal, date: today() };
      await saveDay(fresh);
      await saveEaten([]);
      setGoal(fresh.goal);
      setRemaining(fresh.remaining);
      setEaten([]);
      setStartOfDay(false); // user already has a goal; we just rolled remaining
    }
  };

  const rehydrate = async () => {
    const day = await loadDay();
    const list = await loadEaten();

    if (!day) {
      // first run: keep startOfDay=true; user will setDailyGoal
      setEaten(list ?? []);
      return;
    }
    // same-day or will be corrected by ensureRollover on focus
    setGoal(day.goal);
    setRemaining(day.remaining);
    setEaten(list ?? []);
    setStartOfDay(false);
  };

  const setDailyGoal = async (g: MacroData) => {
    const d: PersistedDay = { goal: g, remaining: g, date: today() };
    await saveDay(d);
    await saveEaten([]); // fresh day when setting goal explicitly
    setGoal(g);
    setRemaining(g);
    setEaten([]);
    setStartOfDay(false);
  };

  const addFood = async (entry: EatenEntry) => {
    if (!remaining) return;

    // Update eaten list
    const nextList = [...eaten, entry];
    setEaten(nextList);
    await saveEaten(nextList);

    // Subtract from remaining
    const updated: PersistedDay = {
      goal: (goal ?? entry.macros), // fallback, should always have goal by now
      remaining: {
        calories: remaining.calories - entry.macros.calories,
        protein : remaining.protein  - entry.macros.protein,
        carbs   : remaining.carbs    - entry.macros.carbs,
        fat     : remaining.fat      - entry.macros.fat,
      },
      date: today(),
    };
    setRemaining(updated.remaining);
    await saveDay(updated);
  };

  const value: Ctx = useMemo(
    () => ({
      startOfDay,
      goal,
      remaining,
      eaten,
      setDailyGoal,
      addFood,
      rehydrate,
    }),
    [startOfDay, goal, remaining, eaten]
  );

  return <MacrosCtx.Provider value={value}>{children}</MacrosCtx.Provider>;
}

export const useMacros = () => {
  const ctx = useContext(MacrosCtx);
  if (!ctx) throw new Error('useMacros must be used inside MacrosProvider');
  return ctx;
};