import { View, Image, Text } from 'react-native';
import React from 'react';
import { styled } from 'nativewind';  // Import NativeWind

const Profile = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* GIF in the center */}
      <Text className="text-2xl font-bold">Sorry, App coming soon</Text>
      <Image
        source={{ uri: 'https://www.devicers.com/wp-content/uploads/2022/02/02-treatment.gif' }}
        className="w-full h-[46%]"  // Tailwind classes for size
      />
    </View>
  );
};

export default Profile;


