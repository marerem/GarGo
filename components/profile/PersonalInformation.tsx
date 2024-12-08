import { Text, View, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { useAuthContext } from '@/context/AuthProvider'
import Profile from '@/lib/backend/profile'
import { useNavigation } from '@react-navigation/native';
export default function PersonalInformation() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const user = useAuthContext();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      console.log('First Name:', firstName);
      console.log('Last Name:', lastName);
      console.log('Phone Number:', phoneNumber);
  
      await Profile.set_name(user.user.email, firstName, lastName);
      await Profile.set_phone(user.user.email, phoneNumber);
      await Profile.set_id(user.user.email, user.user.$id);
  
      console.log('User information updated successfully:', user);
      navigation.navigate("Home");
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl mb-4">Personal Information</Text>

      <TextInput
        className="border rounded p-2 w-80 mb-4"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        className="border rounded p-2 w-80 mb-4"
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        className="border rounded p-2 w-80 mb-4"
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}