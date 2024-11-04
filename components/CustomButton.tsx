/* Import installed modules */
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

/* Define and export the component */
export default function CustomButton({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading = false,
} : {
  title: string,
  handlePress: () => void,
  containerStyles?: string,
  textStyles?: string,
  isLoading?: boolean
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>

      {isLoading && ( <ActivityIndicator color="#fff" size="small" className="ml-2"/> )}
    </TouchableOpacity>
  );
};