import { ViewStyle, StyleProp, TextStyle } from "react-native";
export default interface MacroData {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }
export type EnterMacrosProps ={
  setCalories: React.Dispatch<React.SetStateAction<string>>, 
    setProtein: React.Dispatch<React.SetStateAction<string>>, 
    setCarbs: React.Dispatch<React.SetStateAction<string>>, 
    setFat: React.Dispatch<React.SetStateAction<string>>, 
    saveGoal: () => void
}
export type MotiProps = {
    size?: number;       // base diameter
    color?: string;      // circle color
    scaleFrom?: number;  // min scale
    scaleTo?: number;    // max scale
    durationMs?: number; // one-way duration
    style?: ViewStyle;
  };

export type Ring = {
    label: string;
    fill: number;
    color: string;
}

export type EatenEntry = {
    name: string,
    macros: MacroData
}
export type HistoryModalProps = {
    /** Controls visibility of the modal */
    isVisible: boolean;
  
    /** Style for the modal backdrop (usually a semi-transparent dark overlay) */
    backdropStyle?: StyleProp<ViewStyle>;
  
    /** Style for the main card container */
    cardStyle?: StyleProp<ViewStyle>;
  
    /** Style for the title text */
    modalTitleStyle?: StyleProp<TextStyle>;
  
    /** Style for the cancel/close button */
    cancleStyle?: StyleProp<ViewStyle>;
  
    /** Function to toggle modal open/close */
    handleHistoryOpen: () => void;
  };