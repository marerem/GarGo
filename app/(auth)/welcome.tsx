/* Import installed modules */
import React from 'react'
import { Text, View, ScrollView, Image } from 'react-native'
import { router } from 'expo-router'
import {SafeAreaView} from 'react-native-safe-area-context'

/* Import custom modules */
import { images } from '@/constants'
import CustomButton from '@/components/CustomButton';

/* Define and export the component */
export default function Welcome() {
    /* Return the JSX */
    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className='min-h-[85vh] flex justify-center items-center w-full px-4'>
                    <Image
                        source={images.greenlogo}
                        className='max-w-[300px] h-[130px] mt-[-70px]'
                        resizeMode='contain'
                    />
                    <View className='relative mt-5'>
                        <Text className='text-3xl text-white font-bold text-center'>
                            Discover Endless Possibilities with {" "}
                            <Text className='text-secondary-200'>CarGo</Text>
                        </Text>
                        <Image
                            source={images.path}
                            className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
                        Eco-friendly crowdshipping for flexible, affordable peer-to-peer deliveries
                    </Text>
                    <CustomButton 
                        title="Continue with email"
                        handlePress={() => router.push("./sign_in")}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};