import React, { useContext } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { router } from 'expo-router';

/* Import custom modules */
import Auth from "@/lib/backend/auth";

export default function Home() {
  const navigation = useNavigation();

  const logout = async () => {
    /* Implement the logout logic */
    await Auth.logout()

    /* Redirect the user to the sign in page */
    router.replace("/")
  }

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: () => {logout();}}
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
          <Text style={{ color: '#ffffff', fontSize: 24 }}>JK</Text>
        </View>
        {/* Profile details */}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Jiko Kolio</Text>
        <Text style={{ color: '#888' }}>New User</Text>
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
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>My Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>My Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>My Deliveries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>My Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }} onPress={handleContactUs}>
          <Text style={{ fontSize: 18 }}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }} onPress={handleLogout}>
          <Text style={{ fontSize: 18, color: 'red' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}