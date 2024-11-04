/* Import installed modules */
import React, {useEffect, useState } from 'react'
import { Text, ActivityIndicator, View} from 'react-native'
import { Redirect } from 'expo-router'
import {SafeAreaView} from 'react-native-safe-area-context'

/* Import custom modules */
import { useAuthContext } from '@/context/AuthProvider'

/* Define and export the component */
export default function App() {
    /* Get user data from the context */
    const {user, refreshUser } = useAuthContext()
    const [isLoaded, setIsLoaded] = useState(false)

    /* Once the element is loaded refresh the context and choose the right page */
    useEffect(() => {
        refreshUser().then(() => {
            setIsLoaded(true)
        });
    }, [])

    /* Once the page is loaded, choose the right page */
    if (isLoaded) {
        if (user != null) return <Redirect href="/(tabs)/home" />
        else return <Redirect href="/(auth)/welcome" />
    }
    /* Return the loading screen */
    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="h-full flex justify-center items-center">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white text-center mt-5">Loading...</Text>
            </View>
        </SafeAreaView>
    )
};