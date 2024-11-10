import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const ParcelCard = ({ parcel : { title, thumbnail, parcel,
creator: { username, avatar }} }) => {
  return (
    <View>
      <Text>ParcelCard</Text>
    </View>
  )
}

export default ParcelCard;