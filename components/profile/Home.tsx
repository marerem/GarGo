import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { useAuthContext } from '@/context/AuthProvider';

/* Import custom modules */
import Auth from "@/lib/backend/auth";
import Profile from "@/lib/backend/profile";

export default function Home() {
  const navigation = useNavigation();
  const [profileName, setProfileName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const user = useAuthContext();

  const fetchProfileInfo = async () => {
    try {
      const userEmail = user.user.email; // Assuming this method exists in Auth module to get the current user email
      const userInfo = await Profile.getInfo(userEmail);

      if (userInfo.documents && userInfo.documents.length > 0) {
        const user = userInfo.documents[0];
        if (user.first_name !== null) {
          setProfileName(`${user.first_name} ${user.last_name}`);
          setPhoneNumber(`${user.phone}`);
        } else {
          setProfileName('New User');
          setPhoneNumber('');
        }
      } else {
        setProfileName('New User');
        setPhoneNumber('');
      }
    } catch (error) {
      console.error("Error fetching profile info:", error);
      setProfileName('New User');
      setPhoneNumber('');
    }
  };

  // Fetch profile info when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchProfileInfo();
    }, [])
  );

  const logout = async () => {
    /* Implement the logout logic */
    await Auth.logout();

    /* Redirect the user to the sign-in page */
    router.replace("/");
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: () => { logout(); } }
      ]
    );
  };

  const handleContactUs = () => {
    const url = 'https://cargorelay.io/';
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
      Alert.alert("Error", "Failed to open the Contact Us page.");
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      {/* Header with Profile Info */}
      <View style={{ backgroundColor: 'white', padding: 16, alignItems: 'center', marginBottom: 16 }}>
        {/* Profile image placeholder */}
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#ffffff', fontSize: 24 }}>{profileName.charAt(0)}</Text>
        </View>
        {/* Profile details */}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{profileName}</Text>
        <Text style={{ color: '#888' }}>{phoneNumber}</Text>
      </View>

      {/* Wallet Section */}
      <View style={{ backgroundColor: '#007bff', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 16, marginHorizontal: 16 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Wallet</Text>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>0 €</Text>
        <Text style={{ color: 'white' }}>Available balance</Text>
      </View>

      {/* Did You Know Section */}
      <View style={{ backgroundColor: '#d4edda', padding: 16, borderRadius: 10, marginBottom: 16, marginHorizontal: 16 }}>
        <Text style={{ color: '#155724', fontWeight: 'bold', marginBottom: 4 }}>Did you know?</Text>
        <Text>With CarGoRelay, you help the environment! Each delivery saves an average of 25 kg of CO₂.</Text>
      </View>

      {/* Profile Completion Section */}
      <View style={{ backgroundColor: '#f8d7da', padding: 16, borderRadius: 10, marginBottom: 16, marginHorizontal: 16 }}>
        <Text style={{ color: '#721c24', fontWeight: 'bold', marginBottom: 4 }}>Profile Picture</Text>
        <Text>Complete your CarGoRelay account by adding a profile picture. It's easy, friendly, and secure, and it will show others who you are during your co-transporting journeys!</Text>
        <TouchableOpacity>
          <Text style={{ color: '#721c24', marginTop: 8 }}>Add my profile picture</Text>
        </TouchableOpacity>
      </View>

      {/* Options Section */}
      <View style={{ backgroundColor: 'white', borderRadius: 10, marginBottom: 16, marginHorizontal: 16 }}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }} onPress={() => navigation.navigate('SettingsMenu')}>
          <Text style={{ fontSize: 18 }}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={handleContactUs}>
          <Text style={{ fontSize: 18 }}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={handleLogout}>
          <Text style={{ fontSize: 18, color: 'red' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
