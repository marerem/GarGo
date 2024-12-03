import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../components/profile/Home';
import SettingsMenu from '../../components/profile/SettingsMenu';
import Password from '../../components/profile/Password';
// import Payments from '../../components/profile/Payments';
import { NavigationContainer } from '@react-navigation/native';

const ProfileStack = createNativeStackNavigator();

export default function Profile() {
  // Debugging output for Profile component
  useEffect(() => {
    console.log('Profile component has been rendered');
  }, []);

  return (
    <NavigationContainer>

    <ProfileStack.Navigator initialRouteName="Home">
      {/* Debugging output for each screen */}
      <ProfileStack.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          headerShown: false 
        }} 
        listeners={({ navigation, route }) => {
          // Debugging output for navigating to Home
          console.log('Navigating to Home screen');
        }}
      />
      
      <ProfileStack.Screen 
        name="SettingsMenu" 
        component={SettingsMenu} 
        options={{ 
          title: 'Settings',         
          headerBackTitle: 'Back'    
        }}
        listeners={({ navigation, route }) => {
          // Debugging output for navigating to SettingsMenu
          console.log('Navigating to SettingsMenu screen');
        }}
      />
      
      {/* <ProfileStack.Screen 
        name="Payments" 
        component={Payments} 
        options={{ 
          title: 'Payments', 
          headerBackTitle: 'Back' 
        }}
      /> */}
      
      <ProfileStack.Screen 
        name="Password" 
        component={Password} 
        options={{ 
          title: 'Change Password' 
        }}
        listeners={({ navigation, route }) => {
          // Debugging output for navigating to Password screen
          console.log('Navigating to Password screen');
        }}
      />
    </ProfileStack.Navigator>
    </NavigationContainer>

  );
}
