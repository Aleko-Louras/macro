import { Modal, View, Text, Pressable, KeyboardAvoidingView, Platform, StyleProp, ViewStyle, TextStyle} from "react-native"
import type { MacroData, EatenEntry, HistoryModalProps } from "../Types";



export default function HistoryModal({isVisible, backdropStyle, cardStyle, modalTitleStyle, eaten, cancleStyle, handleHistoryOpen}: HistoryModalProps){
    return (
        <>
        {/* History modal */}
        <Modal visible={isVisible} animationType="fade" transparent onRequestClose={handleHistoryOpen}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={backdropStyle}>
              <View style={cardStyle}>
                <Text style={modalTitleStyle}>Eaten Today</Text>
                {eaten.length === 0 ? (
                  <Text>No items yet.</Text>
                ) : (
                  eaten.map((it, i) => (
                    <View key={i} style={{ backgroundColor: 'lightpink', marginVertical: 6, borderWidth: 2, borderColor: 'black', borderRadius: 10, padding: 5}}>
                      <Text style={{ fontWeight: '600' }}>{it.name}</Text>
                      <Text>Calories: {it.macros.calories}</Text>
                      <Text>Protein : {it.macros.protein} g</Text>
                      <Text>Carbs   : {it.macros.carbs} g</Text>
                      <Text>Fat     : {it.macros.fat} g</Text>
                    </View>
                  ))
                )}
                <Pressable style={cancleStyle} onPress={handleHistoryOpen}>
                  <Text>Close</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </>
    )
}