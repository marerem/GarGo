import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Alert, Dimensions, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import Auth from '@/lib/backend/auth';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this for icons

export default function ChangePassword() {
  /* State variables */
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  
  const [isPasswordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirmNew: false,
  });

  const [isFocused, setFocused] = useState({
    current: false,
    new: false,
    confirmNew: false,
  });

  /* Toggle password visibility */
  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  /* Submit function */
  const submit = async () => {
    if (form.currentPassword === "" || form.newPassword === "" || form.confirmNewPassword === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (!isPasswordValid(form.newPassword)) {
      Alert.alert("Error", "Password does not meet criteria");
      return;
    }
    
    // Log the current and new passwords for debugging
    console.log("Current Password:", form.currentPassword);
    console.log("New Password:", form.newPassword);

    setSubmitting(true);
    try {
      await Auth.changePassword(form.currentPassword, form.newPassword);
      Alert.alert("Success", "Password changed successfully");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  /* Password validation */
  const isPasswordValid = (password) => {
    const criteria = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[%#:*$!?-])[A-Za-z\d%#:*$!?-]{8,}$/;
    return criteria.test(password);
  };

  /* Render component */
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{ minHeight: Dimensions.get("window").height - 100 }}
        >
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Change Password
          </Text>

          {/* Current Password Field */}
          <View style={{ position: 'relative' }}>
            <FormField
              title="Current Password"
              value={form.currentPassword}
              type={isPasswordVisible.current ? "text" : "password"}
              placeholder="Enter current password"
              handleChangeText={(value) => setForm({ ...form, currentPassword: value })}
              viewAdditionalStyle="mt-10"
              onFocus={() => setFocused({ ...isFocused, current: true })}
              onBlur={() => setFocused({ ...isFocused, current: false })}
            />
            {/* Eye Icon for Current Password */}
            {isFocused.current && (
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('current')}
                style={{ position: 'absolute', right: 10, top: 15 }}
              >
                <Ionicons name={isPasswordVisible.current ? "eye-off" : "eye"} size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          {/* New Password Field */}
          <View style={{ position: 'relative' }}>
            <FormField
              title="New Password"
              value={form.newPassword}
              type={isPasswordVisible.new ? "text" : "password"}
              placeholder="Enter new password"
              handleChangeText={(value) => setForm({ ...form, newPassword: value })}
              viewAdditionalStyle="mt-7"
              onFocus={() => setFocused({ ...isFocused, new: true })}
              onBlur={() => setFocused({ ...isFocused, new: false })}
            />
            {/* Eye Icon for New Password */}
            {isFocused.new && (
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('new')}
                style={{ position: 'absolute', right: 10, top: 15 }}
              >
                <Ionicons name={isPasswordVisible.new ? "eye-off" : "eye"} size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          {/* Confirm New Password Field */}
          <View style={{ position: 'relative' }}>
            <FormField
              title="Confirm New Password"
              value={form.confirmNewPassword}
              type={isPasswordVisible.confirmNew ? "text" : "password"}
              placeholder="Re-enter new password"
              handleChangeText={(value) => setForm({ ...form, confirmNewPassword: value })}
              viewAdditionalStyle="mt-7"
              onFocus={() => setFocused({ ...isFocused, confirmNew: true })}
              onBlur={() => setFocused({ ...isFocused, confirmNew: false })}
            />
            {/* Eye Icon for Confirm New Password */}
            {isFocused.confirmNew && (
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('confirmNew')}
                style={{ position: 'absolute', right: 10, top: 15 }}
              >
                <Ionicons name={isPasswordVisible.confirmNew ? "eye-off" : "eye"} size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          {/* Password Criteria */}
          <Text className="text-sm text-gray-100 mt-5">
            Password must be at least 8 characters long and contain:
            {"\n"}- One uppercase letter
            {"\n"}- One lowercase letter
            {"\n"}- One number
            {"\n"}- One special character (% # : $ * ! ? -)
          </Text>

          {/* Submit Button */}
          <CustomButton
            title="Submit"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};