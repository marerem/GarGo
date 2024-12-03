/* Import installed modules */
import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import { useFonts } from 'expo-font'

/* Import custom modules */
import AuthProvider from '@/context/AuthProvider'
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  /* Set the fonts */
  const [fontsLoaded,error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  })

  useEffect(() => {
      if (error) throw error;
      if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded,error])
  if (!fontsLoaded && !error) return null;

  /* Return the component template */
  return (
    <AuthProvider>
        {/* NavigationContainer wraps the Stack */}
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    </AuthProvider>
  );
};

export default RootLayout