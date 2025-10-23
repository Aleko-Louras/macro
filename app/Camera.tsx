import React, { useState } from 'react';
import {
  View, Text, Alert, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, Platform, Touchable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

import { useMacros } from '@/app/Providers/MacrosContext';
import type { MacroData } from '@/app/Providers/MacrosContext';
export default function CameraScreen() {
  const router = useRouter();
  const { addFood } = useMacros();

  // camera permission
  const [permission, requestPermission] = useCameraPermissions();

  // local/transient UI state
  const [scanned, setScanned] = useState(false);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [foodName, setFoodName] = useState<string>('Item');
  const [macrosOfFood, setMacrosOfFood] = useState<MacroData | null>(null);

  const [manualOpen, setManualOpen] = useState(false);
  const [mCalories, setMCalories] = useState('');
  const [mProtein, setMProtein]   = useState('');
  const [mCarbs, setMCarbs]       = useState('');
  const [mFat, setMFat]           = useState('');
  const [multiplier, setMultiplier] = useState(0);

  const saveManualMacros = () => {
    if((mCalories && mProtein && mCarbs && mFat) == ""){
      Alert.alert("One or more Macros are empty!", "Please enter all macros.")
      return
    }
    const m: MacroData = {
      calories: Number(mCalories) || 0,
      protein : Number(mProtein)  || 0,
      carbs   : Number(mCarbs)    || 0,
      fat     : Number(mFat)      || 0,
    };
    setMacrosOfFood(m);
    setFoodName('Manual entry');
    setScanned(true);
    setManualOpen(false);
    setMCalories(''); setMProtein(''); setMCarbs(''); setMFat('');
  };

  const fetchNutrition = async (barcode: string) => {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1) {
        const n = data.product?.nutriments ?? {};
        setMacrosOfFood({
          calories: n['energy-kcal_serving'] ?? n['energy-kcal_100g'] ?? 0,
          protein : n['proteins_serving']    ?? n['proteins_100g']    ?? 0,
          fat     : n['fat_serving']         ?? n['fat_100g']         ?? 0,
          carbs   : n['carbohydrates_serving'] ?? n['carbohydrates_100g'] ?? 0,
        });
        setFoodName(data.product?.product_name || 'Unknown item');
        setScanned(true);
      } else {
        setScanned(true); // pause preview
        Alert.alert('Product not found', 'You can enter macros manually.', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      }
    } catch (err) {
      Alert.alert('Error fetching data');
    } finally {
      setLookupBusy(false);
    }
  };

  const onBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned || lookupBusy) return;
    setLookupBusy(true);
    fetchNutrition(result.data);
  };

  const multiplyMacros = (value: number) => {
    if (!value || !macrosOfFood) return;
    setMacrosOfFood({
      calories: macrosOfFood.calories * value,
      protein : macrosOfFood.protein  * value,
      carbs   : macrosOfFood.carbs    * value,
      fat     : macrosOfFood.fat      * value,
    });
  };

  const addToDay = async () => {
    if (!macrosOfFood) return;
    await addFood({ name: foodName, macros: macrosOfFood });
    router.back(); // go back to Home with updated context values
  };

  // Permission gates
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Preparing camera…</Text>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ textAlign: 'center', marginBottom: 12 }}>
          We need camera access to scan barcodes.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.primary}>
          <Text style={{ color: 'black' }}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!scanned ? (
        <>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13','ean8','upc_a','upc_e','code39','code128','qr'],
            }}
            onBarcodeScanned={scanned || lookupBusy ? undefined : onBarcodeScanned}
          />
          
          <TouchableOpacity style={styles.homeButton} onPress={() => router.navigate('/')}>
            <Text style={{ color: 'white', fontSize: 16 }}>Home</Text>
          </TouchableOpacity>

          <View pointerEvents="none" style={styles.scanFrame}>
            <View style={styles.scanFrameInner} />
          </View>

          <TouchableOpacity style={styles.manualButton} onPress={() => setManualOpen(true)}>
            <Text style={{ color: 'white', fontSize: 16 }}>Enter Manually</Text>
          </TouchableOpacity>

          <Modal visible={manualOpen} animationType="fade" transparent onRequestClose={() => setManualOpen(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.backdrop}>
              <View style={styles.card}>
                <Text style={styles.modalTitle}>Manual Macros</Text>
                <TextInput style={styles.modalInput} placeholderTextColor="gray" keyboardType="numeric" placeholder="Calories" value={mCalories} onChangeText={setMCalories} />
                <TextInput style={styles.modalInput} placeholderTextColor="gray" keyboardType="numeric" placeholder="Protein (g)" value={mProtein} onChangeText={setMProtein} />
                <TextInput style={styles.modalInput} placeholderTextColor="gray" keyboardType="numeric" placeholder="Carbs (g)"   value={mCarbs}   onChangeText={setMCarbs} />
                <TextInput style={styles.modalInput} placeholderTextColor="gray" keyboardType="numeric" placeholder="Fat (g)"     value={mFat}     onChangeText={setMFat} />
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Pressable style={styles.modalCancel} onPress={() => setManualOpen(false)}>
                    <Text>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.modalSave} onPress={saveManualMacros}>
                    <Text style={{ color: 'white' }}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </>
      ) : (
        <View style={styles.center}>
          {macrosOfFood ? (
            <>
              <Text style={styles.title}>Scanned Item</Text>
              <Text style={{ marginBottom: 6, fontWeight: '600' }}>{foodName}</Text>
              <Text>Calories: {macrosOfFood.calories}</Text>
              <Text>Protein : {macrosOfFood.protein} g</Text>
              <Text>Carbs   : {macrosOfFood.carbs} g</Text>
              <Text>Fat     : {macrosOfFood.fat} g</Text>

              <View style={styles.servingsRow}>
                <TextInput
                  style={styles.servingInput}
                  onChangeText={t => setMultiplier(Number(t))}
                  placeholder="Serving ×"
                  placeholderTextColor="gray"
                  keyboardType="numbers-and-punctuation"
                />
                <TouchableOpacity style={styles.setServingsButton} onPress={() => multiplyMacros(multiplier)}>
                  <Text>Set serving</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToDayButton} onPress={addToDay}>
                  <Text style={{ fontSize: 18 }}>Add to my Day</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.backScannerButton} onPress={() => setScanned(false)}>
                <Text style={{ fontSize: 18 }}>Back to scanner</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Loading…</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },

  // overlay frame
  scanFrame: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  scanFrameInner: { width: 240, height: 240, borderWidth: 3, borderColor: 'pink', borderRadius: 16, backgroundColor: 'transparent' },

  manualButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#ff7e7e', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, borderColor: 'white', borderWidth: 2 },

  servingInput: { borderColor: 'black', borderWidth: 1, borderRadius: 10, height: 50, width: 90, textAlign: 'center' },
  servingsRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 30, flexWrap: 'wrap', justifyContent: 'center' },
  setServingsButton: { borderColor: 'black', borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: 'lightpink', marginLeft: 10 },
  addToDayButton: { borderColor: 'pink', borderWidth: 2, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 15, marginLeft: 10, backgroundColor: '#ffe5ec' },
  backScannerButton: { borderColor: 'black', borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#fddada', marginTop: 30 },

  primary: { borderColor: '#000', borderWidth: 2, backgroundColor: 'pink', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },

  // modal
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  card: { width: 300, backgroundColor: 'white', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  modalInput: { borderColor: '#aaa', borderWidth: 1, borderRadius: 8, padding: 6, marginTop: 10, textAlign: 'center', color: 'black' },
  modalCancel: { marginRight: 8, padding: 10, borderRadius: 8, backgroundColor: 'pink', alignItems: 'center' },
  modalSave: { flex: 1, marginLeft: 8, padding: 10, borderRadius: 8, backgroundColor: '#ff7e7e', alignItems: 'center' },
  homeButton: {position: 'absolute', top: 80, left: 20, alignSelf: 'center', backgroundColor: '#ff7e7e', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, borderColor: 'white', borderWidth: 2 }
});