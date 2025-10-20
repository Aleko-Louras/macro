import {View, TextInput, TouchableOpacity, Text, StyleSheet} from 'react-native'

import type { EnterMacrosProps } from '../Types'
export default function EnterMacros({setCalories, setProtein, setCarbs, setFat, saveGoal}: EnterMacrosProps){
    return (
        <>
        <View style={styles.centerBox}>
          <Text style={styles.header}>Enter your Macros for the Day</Text>

          <TextInput style={styles.input} onChangeText={setCalories} placeholderTextColor="gray" placeholder="Calories"       keyboardType="numbers-and-punctuation" />
          <TextInput style={styles.input} onChangeText={setProtein} placeholderTextColor="gray"  placeholder="Protein (g)"    keyboardType="numbers-and-punctuation" />
          <TextInput style={styles.input} onChangeText={setCarbs} placeholderTextColor="gray"   placeholder="Carbs (g)"      keyboardType="numbers-and-punctuation" />
          <TextInput style={styles.input} onChangeText={setFat}  placeholderTextColor="gray"    placeholder="Fat (g)"        keyboardType="numbers-and-punctuation" />

          <TouchableOpacity style={styles.primary} onPress={saveGoal}>
            <Text style={{ fontSize: 18 }}>Save Macros</Text>
          </TouchableOpacity>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    input: { borderColor: 'black', borderWidth: 1, fontSize: 20, padding: 6, borderRadius: 8, marginTop: 10, width: 200, textAlign: 'center' }, 
    header: { fontSize: 40, textAlign: 'center', marginBottom: 30 }, 
    centerBox: {backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 16, flex: 1}, 
    primary: { borderColor: 'black', borderWidth: 2, backgroundColor: 'pink', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginTop: 25 },
})