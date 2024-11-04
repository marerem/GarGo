import { styled } from 'nativewind';
import { Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import CustumButton from '@/components/CustumButton';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function App() {
    const {isLoading, isLoggedIn} = useGlobalContext()
    if (!isLoading && !isLoggedIn) return <Redirect href="/home" />;

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
                        <CustumButton 
                        title="Continue with email"
                        handlePress={() => router.push("/sign_in")}
                        containerStyles="w-full mt-7"
                        />
                </View>
            </ScrollView>
            <StatusBar backgroundColor='#0f3d33' style='light'/>
        </SafeAreaView>
    );
};

/*
const StyledView = styled(View)
const StyledText = styled(Text)
const RootLayout = () => {
return (
    <StyledView className='flex-1 justify-center items-center bg-white'>
    <StyledText className="text-3xl font-pblack">Main page</StyledText>
    <StatusBar style="auto" />
    <Link href="/home" style={{ color: 'blue', marginTop: 16 }}>
        Go to Home
    </Link>
    </StyledView>
);
};

export default RootLayout

*/


