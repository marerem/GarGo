import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Import the Image Picker

import { useAuthContext } from "@/context/AuthProvider";
/* Import custom modules */
import Auth from "@/lib/backend/auth";
import ProfilePicture from "@/lib/backend/ProfilePicture";
import { DB_SETTINGS } from "@/constants/ProfilePicture";

const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  project: "6728e2c90039161a6de4",
  platform: "com.jsm.cargo",
};


export default function Home() {

  const navigation = useNavigation();
  const { user } = useAuthContext();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const profile = user?.$id ? new ProfilePicture(user.$id) : null;
  const [profilePictureExists, setProfilePictureExists] = useState(false); // Track if the user has a profile picture

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!profile) return;

      try {
        setLoading(true);
        const previewUrl = await profile.getProfilePicturePreview();
        setProfilePicture(previewUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
  }, [user]);


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


  const handleImagePicker = async (fromCamera: boolean) => {
    if (!profile) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    try {
      const permissionResult = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to grant permission to access this feature.");
        return;
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

      if (!result.canceled) {
        console.log('Selected image:', result.assets[0]); // Debugging statement
        const profile = new ProfilePicture(user.$id);
        const uploadResult = await profile.uploadImage({ uri: result.assets[0].uri, type: 'image/jpeg', size: result.assets[0].fileSize || 0 });

        const imageUrl = profile.previewUrl;
        console.log('Uploaded profile picture URL:', imageUrl); // Debugging statement
        setProfilePicture(imageUrl);
        setProfilePictureExists(true);
      }
    } catch (error) {
      console.error("Error selecting profile picture:", error.message);
      Alert.alert("Error", "Failed to add a profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!profile) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    try {
      setLoading(true);
      await profile.removeProfilePicture();
      setProfilePicture(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error.message);
      Alert.alert("Error", "Failed to delete profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeOrDelete = () => {
    Alert.alert(
      "Profile Picture",
      "Do you want to retake your profile picture or delete it?",
      [
        { text: "Retake", onPress: () => handleImagePicker(true) },
        { text: "Delete", onPress: handleDeleteProfilePicture },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      {/* Header with Profile Info */}
      <View style={{ backgroundColor: 'white', padding: 16, alignItems: 'center', marginBottom: 16 }}>
        {/* Profile image placeholder */}
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}>
          {profilePicture ? (
            <TouchableOpacity onPress={handleRetakeOrDelete}>
              <Image source={{ uri: profilePicture }} style={{ width: '100%', height: '100%', borderRadius: 40 }} />
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#ffffff', fontSize: 24 }}>
              {user?.name
                ? user.name
                    .split(" ") // Split full name into words
                    .map((n) => n[0]) // Get first letter of each word
                    .join("") // Combine initials
                : "NA"} {/* Fallback initials */}
            </Text>
          )}
        </View>
        {/* Display User Name */}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          {user?.name || "Guest"} {/* Fallback to Guest */}
        </Text>
        {/* Display User Status */}
        <Text style={{ color: '#888' }}>
          {user?.status || "New User"} {/* Fallback to New User */}
        </Text>
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
        <Text>Complete your CarGoRelay account by adding a profile picture. It's easy, friendly, and secure!</Text>
        <TouchableOpacity onPress={() => handleImagePicker(false)}>
          <Text style={{ color: '#721c24', marginTop: 8 }}>Upload from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImagePicker(true)}>
          <Text style={{ color: '#721c24', marginTop: 8 }}>Take a Picture</Text>
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
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}onPress={() => navigation.navigate('Payments')}>
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