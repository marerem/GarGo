/* Import installed modules */
import React, {useState} from 'react'
import { Text, View, Image, TextInput, TouchableOpacity, KeyboardTypeOptions } from 'react-native'

/* Import custom modules */
import { icons } from "@/constants";

/* Define and export the component */
export default function FormField(
  { 
    title, 
    value,
    type,
    placeholder, 
    handleChangeText, 
    viewAdditionalStyle,
    keyboardType = "default"
  } : 
  { 
    title: string, 
    value: string, 
    type: string,
    placeholder: string, 
    handleChangeText: (e: string) => void, 
    viewAdditionalStyle?: string, 
    keyboardType?: KeyboardTypeOptions,
  }
) {
  /* Define the state variables */
  const [showPassword, setShowPassword] = useState(false);

  /* Return the component structure */
  return (
    <View className={`space-y-2 ${viewAdditionalStyle}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 bg-black-200 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={type === "password" && !showPassword}
          keyboardType={keyboardType}
        />
        {type === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain"/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


