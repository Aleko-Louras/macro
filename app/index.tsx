
import MacroCircles from '@/app/Components/MacroCircles';
import { useMacros } from '@/app/Providers/MacrosContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal, Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import EnterMacros from './Components/EnterMacros';
import HistoryModal from './Components/HistoryModal';
export default function Home() {
  const router = useRouter()
  const { setStartOfDay, startOfDay, goal, remaining, setDailyGoal } = useMacros();
  const [changeModalOpen, setChangeModalOpen] = useState(false)
  // UI-only state for this screen
  const [historyOpen, setHistoryOpen] = useState(false);

  // Inputs for first-time daily goal
  const [calories, setCalories] = useState('');
  const [protein, setProtein]   = useState('');
  const [carbs, setCarbs]       = useState('');
  const [fat, setFat]           = useState('');

  const saveGoal = async () => {
    if((calories && protein && carbs && fat) === ''){
      Alert.alert("One or more Macros are empty!", "Please enter all macros.")
      return
    }
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
        <EnterMacros setCalories={setCalories} setProtein={setProtein} setCarbs={setCarbs} setFat={setFat} saveGoal={saveGoal}/>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SafeAreaView style={styles.centerBox}>
            {remaining && (
              <>
                <Text style={styles.title}>Macros Remaining Today</Text>
                <Text style={styles.macros}>Calories : {Math.round(remaining.calories)}</Text>
                <Text style={styles.macros}>Protein : {Math.round(remaining.protein)} g</Text>
                <Text style={styles.macros}>Carbs : {Math.round(remaining.carbs)} g</Text>
                <Text style={styles.macros}>Fat : {Math.round(remaining.fat)} g</Text>
                <MacroCircles goal={goal} remaining={remaining} />
                <TouchableOpacity style={styles.secondary} onPress={() => setHistoryOpen(true)}>
                  <Text style={{ fontSize: 18 }}>What I've Eaten Today</Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.navigate("./Camera")}style={[styles.primary, { marginTop: 16 }]}>
                    <Text style={{ fontSize: 20 }}>Scan Barcode</Text>
                  </TouchableOpacity>
                <TouchableOpacity style={styles.adjustMacros} onPress={() =>  setChangeModalOpen(true)}><Text>Reset Macros for the Day</Text></TouchableOpacity>
              </>
            )}
          </SafeAreaView>
          <HistoryModal isVisible={historyOpen} handleHistoryOpen={() => setHistoryOpen(false)}
          />
          <Modal animationType='fade' transparent onRequestClose={ () => setChangeModalOpen(false)}visible={changeModalOpen}>
            <View style={styles.changeModalBackdrop}>
            <View style={styles.changeModal}>
              <Text style={{textAlign:"center", padding: 5}}>Are you sure you want to reset your macros?</Text>
              <View style={styles.changeButtons}>
                <Pressable style={{ backgroundColor: 'lightgreen', borderWidth: 1, borderColor: 'black', borderRadius: 4, padding: 4}}onPress={() => {setStartOfDay(true); setChangeModalOpen(false);}}><Text>Yes</Text></Pressable>
                <Pressable style={{ backgroundColor: 'orange', borderWidth: 1, borderColor: 'black', borderRadius: 4, padding: 4}} onPress={() => setChangeModalOpen(false)}><Text>No</Text></Pressable>
              </View>
            </View>
            </View>
          </Modal>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerBox: {backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 16,position: 'absolute'},
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 35},
  macros: {textAlign: 'center', fontSize: 20, marginBottom: 4},
  primary: { borderColor: 'black', borderWidth: 2, backgroundColor: 'pink', borderRadius: 10, paddingVertical: 20, paddingHorizontal: 30 },
  secondary: { borderColor: '#999', borderWidth: 2, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#fafafa', marginTop: 20, marginBottom: 10},
  adjustMacros: {borderRadius: 10, borderWidth: 2, borderColor: 'black', marginTop: 70, padding: 8, backgroundColor: 'lemonchiffon', },
  changeModal: {width: 300, height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 2, backgroundColor: 'lightpink', borderRadius: 30, },
  changeModalBackdrop: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  changeButtons: {marginTop: 55, flexDirection: 'row', justifyContent: 'space-around', width: 200}
});