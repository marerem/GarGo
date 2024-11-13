import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../components/profile/Home';
import SettingsMenu from '../../components/profile/SettingsMenu';
import Password from '../../components/profile/Password';

const ProfileStack = createNativeStackNavigator();

export default function Profile() {
  return (
    <ProfileStack.Navigator initialRouteName="Home">
      <ProfileStack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} // Hides the header for Home
      />
      <ProfileStack.Screen 
        name="SettingsMenu" 
        component={SettingsMenu} 
        options={{ 
          title: 'Settings',         // Shows a title for SettingsMenu
          headerBackTitle: 'Back'    // Sets the back button text to "Back"
        }}
      />  
      <ProfileStack.Screen 
        name="Password" 
        component={Password} 
        options={{ 
          title: 'Change Password' 
        }}
      />
    </ProfileStack.Navigator>
  );
}