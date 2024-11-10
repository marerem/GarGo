/* Import installed modules */
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image } from "react-native";

/* Import custom modules */
import { images } from "@/constants";
import CustumButton from '@/components/CustomButton';
import FormField from '@/components/FormField'
import Auth from "@/lib/backend/auth";

/* Define and export the component */
export default function SignUp() {
  /* Define the submit function */
  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await Auth.register(form.username, form.email, form.password);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
      setSubmitting(false);
    }
  };

  /* Define the state variables */
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "",});

  /* Return the component template */
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6">
          <Image
            source={images.whitelogo}
            resizeMode="contain"
            className="w-[380px] h-[70px] mt-[-40px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to CarGo relay
          </Text>

          <FormField
            title="Username"
            value={form.username}
            type="text"
            placeholder="Enter your username"
            handleChangeText={(e) => setForm({ ...form, username: e })}
            viewAdditionalStyle="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            type="email"
            placeholder="Enter your email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            viewAdditionalStyle="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            type="password"
            placeholder="Enter your password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            viewAdditionalStyle="mt-7"
          />

          <CustumButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>
            <Link href="./sign_in" className="text-lg font-psemibold text-secondary">Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};