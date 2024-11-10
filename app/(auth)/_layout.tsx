/* Import installed modules */
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
      <Stack initialRouteName="welcome">
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign_in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign_up"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor='#0f3d33' style='light' />
    </>
  )
}

export default AuthLayout