/* Import installed modules */
import { Text, View, Image, ImageSourcePropType } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'

/* Import custom modules */
import { icons } from '@/constants'

/* Define the tab Icon element */
const TabIcon = ({ icon, color, name, focused }: { icon: ImageSourcePropType, color: string, name: string, focused: boolean }) => {
  useEffect(() => {
    console.log(`${name} tab icon rendered`); // Log when each tab icon is rendered
  }, [focused]); // Focused is a dependency, log whenever the focus changes

  return (
    <View className='items-center justify-center'>
      <Image source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )
}

/* Define and export the TabLayout component */
export default function TabLayout() {
  useEffect(() => {
    console.log('TabLayout component rendered');
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#0f3d33', // #161622 #0f1f12
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 70,
          }
        }}
        initialRouteName="home"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              console.log('Navigating to Home screen');
              // You can also perform actions like preventing navigation, e.g.,
              // e.preventDefault();
            }
          })}
        />

        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.Vector}
                color={color}
                name="Map"
                focused={focused}
              />
            )
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              console.log('Navigating to Map screen');
              // You can also perform actions like preventing navigation
              // e.preventDefault();
            }
          })}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            )
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              console.log('Navigating to Create screen');
              // Perform any additional actions or prevent navigation if needed
            }
          })}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              console.log('Navigating to Profile screen');
              // Perform actions or prevent navigation if needed
            }
          })}
        />
      </Tabs>
    </>
  )
}
