/* Import installed modules */
import { Text, View, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

/* Import custom modules */
import {icons} from '@/constants'

/* Define the tab Icon element */
const TabIcon = ({icon, color, name, focused} : {icon: ImageSourcePropType, color: string, name: string, focused: boolean}) => {
  return (
    <View className='items-center justify-center'>
      <Image source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style = {{color:color}}>
        {name}
      </Text>
    </View>
  )
}

/* Define and export the TabLayout component */
export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#0f3d33' , //#161622 #0f1f12
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
        tabBarIcon: ({color,focused}) => (
          <TabIcon 
            icon={icons.home} 
            color={color} 
            name="Home" 
            focused={focused} />
        )
         }}
        />
          <Tabs.Screen
        name="map"
        options={{ 
        title: 'Map',
        headerShown: false,
        tabBarIcon: ({color,focused}) => (
          <TabIcon 
            icon={icons.Vector} 
            color={color} 
            name="Map" 
            focused={focused} />
        )
         }}
        />
          <Tabs.Screen
        name="create"
        options={{ 
        title: 'Create',
        headerShown: false,
        tabBarIcon: ({color,focused}) => (
          <TabIcon 
            icon={icons.plus} 
            color={color} 
            name="Create" 
            focused={focused} />
        )
         }}
        />
          <Tabs.Screen
          name="profile"
          options={{ 
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon 
              icon={icons.profile} 
              color={color} 
              name="Profile" 
              focused={focused} />
          )
          }}
        />
      </Tabs>
    </>
  )
}
