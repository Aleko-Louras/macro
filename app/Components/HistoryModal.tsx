import { Modal, View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView} from "react-native"
import type { HistoryModalProps } from "../Types";
import { useMacros } from "../Providers/MacrosContext";


export default function HistoryModal({isVisible, backdropStyle, cardStyle, modalTitleStyle, cancleStyle, handleHistoryOpen}: HistoryModalProps){
    const {eaten} = useMacros();
    return (
        <>
        <Modal visible={isVisible} animationType="fade" transparent onRequestClose={handleHistoryOpen}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={backdropStyle}>
              <View style={cardStyle}>
                <Text style={modalTitleStyle}>Eaten Today</Text>
                <ScrollView
                style={{
                  width: 'auto',
                  height: 350,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "lightgray",
                }}
                contentContainerStyle={{
                  padding: 12,    
                }}
                showsVerticalScrollIndicator={true}
                >
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
                </ScrollView>
                <Pressable style={cancleStyle} onPress={handleHistoryOpen}>
                  <Text>Close</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </>
    )
}