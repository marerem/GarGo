/* Import installed modules */
import { router } from "expo-router";
import { View, Text, Image } from "react-native";

/* Import custom modules */
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";

/* Define and export the component */
const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="flex justify-center items-center px-4">
      
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>
      <Text className="text-sm font-pmedium text-gray-100 mt-5">{title}</Text>      
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />
      
      <View className="flex-row w-full justify-between my-5">
        <CustomButton
          title="Send"
          handlePress={() => router.push("/create")}
          containerStyles="flex-1 mr-2"
        />
        <CustomButton
          title="Deliver"
          handlePress={() => router.push("/map")}
          containerStyles="flex-1 ml-2"
        />
      </View>
    </View>
  );
};

export default EmptyState;