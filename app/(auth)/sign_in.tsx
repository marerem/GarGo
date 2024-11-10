/* Import installed modules */
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

/* Import custom modules */
import { images } from "@/constants";
import FormField from '@/components/FormField'
import CustomButton from "@/components/CustomButton";
import Auth from "@/lib/backend/auth";

/* Define and export the component */
export default function SignIn() {
  /* Define the submit function */
  const submit = async () => {
    /* Check the input values */
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    /* Set the loading state */
    setSubmitting(true);
    
    /* Implement the sign in logic */
    try {
      await Auth.pswauth(form.email, form.password);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
      setSubmitting(false);
    }
  };

  /* Define the form states */
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  /* Return the JSX */
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.whitelogo}
            resizeMode="contain"
            className="w-[380px] h-[70px] mt-[-270px]"
          />
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to CarGo relay
          </Text>

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

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href="./sign_up" className="text-lg font-psemibold text-secondary">Signup</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};