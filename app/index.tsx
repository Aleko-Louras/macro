
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import { useMacros } from '@/app/Providers/MacrosContext';
import MacroCircles from '@/app/Components/MacroCircles';
import PulsingCircle from '@/app/Components/PulsingCircle';
import { useRouter } from 'expo-router';
import HistoryModal from './Components/HistoryModal';
export default function Home() {
  const router = useRouter()
  const { startOfDay, goal, remaining, eaten, setDailyGoal } = useMacros();

  // UI-only state for this screen
  const [statsOpen, setStatsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Inputs for first-time daily goal
  const [calories, setCalories] = useState('');
  const [protein, setProtein]   = useState('');
  const [carbs, setCarbs]       = useState('');
  const [fat, setFat]           = useState('');

  const saveGoal = async () => {
    await setDailyGoal({
      calories: Number(calories) || 0,
      protein : Number(protein)  || 0,
      carbs   : Number(carbs)    || 0,
      fat     : Number(fat)      || 0,
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {startOfDay ? (
        <View style={styles.centerBox}>
          <Text style={styles.header}>Enter your Macros for the Day</Text>

          <TextInput style={styles.input} onChangeText={setCalories} placeholder="Calories"       keyboardType="numbers-and-punctuation" />
          <TextInput style={styles.input} onChangeText={setProtein}  placeholder="Protein (g)"    keyboardType="numbers-and-punctuation" />
          <TextInput style={styles.input} onChangeText={setCarbs}    placeholder="Carbs (g)"      keyboardType="numbers-and-punctuation" />
          <TextInput style={styles.input} onChangeText={setFat}      placeholder="Fat (g)"        keyboardType="numbers-and-punctuation" />

          <TouchableOpacity style={styles.primary} onPress={saveGoal}>
            <Text style={{ fontSize: 18 }}>Save Macros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          

          <SafeAreaView style={styles.centerBox}>
            {remaining && (
              <>
                <Text style={styles.title}>Macros Remaining Today</Text>
                <Text>Calories: {Math.round(remaining.calories)}</Text>
                <Text>Protein : {Math.round(remaining.protein)} g</Text>
                <Text>Carbs   : {Math.round(remaining.carbs)} g</Text>
                <Text>Fat     : {Math.round(remaining.fat)} g</Text>

                <MacroCircles goal={goal} remaining={remaining} />

                <TouchableOpacity style={styles.secondary} onPress={() => setHistoryOpen(true)}>
                  <Text style={{ fontSize: 18 }}>What I've Eaten Today</Text>
                </TouchableOpacity>

                
                  <TouchableOpacity onPress={() => router.navigate("./Camera")}style={[styles.primary, { marginTop: 16 }]}>
                    <Text style={{ fontSize: 18 }}>Scan Barcode</Text>
                  </TouchableOpacity>
              </>
            )}
          </SafeAreaView>

          <HistoryModal isVisible={historyOpen} backdropStyle={styles.backdrop} cardStyle={styles.card} modalTitleStyle={styles.modalTitle}
          eaten={eaten} cancleStyle={styles.cancel} handleHistoryOpen={() => setHistoryOpen(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerBox: {backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 16,position: 'absolute'},
  header: { fontSize: 40, textAlign: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },

  input: { borderColor: 'black', borderWidth: 1, fontSize: 20, padding: 6, borderRadius: 8, marginTop: 10, width: 200, textAlign: 'center' },

  primary: { borderColor: 'black', borderWidth: 2, backgroundColor: 'pink', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginTop: 25 },
  secondary: { borderColor: '#999', borderWidth: 2, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#fafafa', marginTop: 20 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  card: { width: 300, backgroundColor: 'white', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  cancel: { marginTop: 16, alignSelf: 'center', padding: 10, borderRadius: 8, backgroundColor: 'pink' },
});