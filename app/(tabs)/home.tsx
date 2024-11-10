/* Import installed modules */
import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

/* Import custom modules */
import Auth from "@/lib/backend/auth";

/* Define and export the component */
export default function Home() {
  const logout = async () => {
    /* Implement the logout logic */
    await Auth.logout()

    /* Redirect the user to the sign in page */
    router.replace("/")
  }

  return (
    <View className="flex justify-center items-center h-full">
      <Text className="text-2xl">Welcome to CarGo relay</Text>
      <TouchableOpacity onPress={logout} className="mt-5 bg-blue-500 p-4 rounded-md">
        <Text className="text-white">Logout</Text>
      </TouchableOpacity>
    </View>
  )
}
