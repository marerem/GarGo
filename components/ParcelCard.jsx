import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import { icons } from "../constants";

const ParcelCard = ({ title, creator, avatar, images,deliver, pickup, dropoff, description, volume, weight, onPress }) => {
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Image
              source={icons.menu}
              className="w-7 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center">
        <Image
          source={{ uri: images?.[0] }}
          className="w-full h-full rounded-xl mt-3"
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default ParcelCard;
