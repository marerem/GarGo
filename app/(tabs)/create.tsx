import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts } from "../../lib/appwrite";
import { useState } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

import { icons } from "../../constants";
import { createVideoPost } from "../../lib/appwrite";
import CustomButton from "@/components/CustumButton";
import FormField from "@/components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";

enum VideoSize {
  S = "S",
  M = "M",
  L = "L",
  XL = "XL"
}

// Add IP validation function
const isValidIPAddress = (ip: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

// Helper function to convert coordinates to IP-like string
const coordinatesToIP = (latitude: number, longitude: number): string => {
  // Convert to positive numbers and take only the first few decimal places
  const lat = Math.abs(Math.floor(latitude * 100));
  const long = Math.abs(Math.floor(longitude * 100));
  
  // Create IP-like format ensuring numbers are within 0-255 range
  return `192.${lat % 256}.${long % 256}.1`;
};

const Create = () => {
  //const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const user = posts?.[0]?.users; 
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    size: null,
    price: 0,
    pickup: "",
    dropoff: "",
  });
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectingLocation, setSelectingLocation] = useState('pickup');

  const openPicker = async (selectType) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const handleSizeSelect = (size: VideoSize) => {
    setForm({
      ...form,
      size: size
    });
  };

  const submit = async () => {
    if (
      form.prompt === "" ||
      form.title === "" ||
      !form.thumbnail ||
      !form.video ||
      !form.size ||
      !form.price ||
      !isValidIPAddress(form.pickup) ||
      !isValidIPAddress(form.dropoff)
    ) {
      return Alert.alert("Please provide all fields with valid values");
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
        size: null,
        price: 0,
        pickup: "",
        dropoff: "",
      });

      setUploading(false);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow location access to use this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  };

  const handleLocationSelect = async (type: 'pickup' | 'dropoff') => {
    setSelectingLocation(type);
    setShowMap(true);
    
    const location = await getCurrentLocation();
    if (location) {
      if (type === 'pickup') {
        setPickupLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setDropoffLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    }
  };

  const confirmLocation = async () => {
    const location = selectingLocation === 'pickup' ? pickupLocation : dropoffLocation;
    if (location) {
      // Convert coordinates to IP format
      const ipAddress = coordinatesToIP(location.latitude, location.longitude);
      
      setForm({
        ...form,
        [selectingLocation]: ipAddress
      });
      setShowMap(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Price (CHF)
          </Text>
          <FormField
            value={form.price.toString()}
            placeholder="Enter price in CHF..."
            handleChangeText={(value) => {
              // Only allow positive integers
              const numericValue = value.replace(/[^0-9]/g, '');
              setForm({ 
                ...form, 
                price: numericValue ? parseInt(numericValue) : 0 
              });
            }}
            keyboardType="numeric"
            otherStyles="mt-2"
          />
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Video Size
          </Text>
          <View className="flex-row space-x-3">
            {Object.values(VideoSize).map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => handleSizeSelect(size)}
                className={`w-12 h-12 rounded-lg ${
                  form.size === size ? 'bg-secondary-100' : 'bg-black-100'
                } justify-center items-center`}
              >
                <Text className="text-white font-pmedium">{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Pickup Location (IP Address)
          </Text>
          <TouchableOpacity 
            onPress={() => handleLocationSelect('pickup')}
            className="flex-row items-center justify-between bg-black-100 p-4 rounded-lg"
          >
            <Text className="text-gray-100">
              {form.pickup || 'Select pickup location'}
            </Text>
            <MaterialIcons name="location-on" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Dropoff Location (IP Address)
          </Text>
          <TouchableOpacity 
            onPress={() => handleLocationSelect('dropoff')}
            className="flex-row items-center justify-between bg-black-100 p-4 rounded-lg"
          >
            <Text className="text-gray-100">
              {form.dropoff || 'Select dropoff location'}
            </Text>
            <MaterialIcons name="location-on" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {showMap && (
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary z-50">
            <MapView
              className="w-full h-full"
              initialRegion={{
                latitude: selectingLocation === 'pickup' 
                  ? (pickupLocation?.latitude || 0)
                  : (dropoffLocation?.latitude || 0),
                longitude: selectingLocation === 'pickup'
                  ? (pickupLocation?.longitude || 0)
                  : (dropoffLocation?.longitude || 0),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => {
                if (selectingLocation === 'pickup') {
                  setPickupLocation(e.nativeEvent.coordinate);
                } else {
                  setDropoffLocation(e.nativeEvent.coordinate);
                }
              }}
            >
              {pickupLocation && selectingLocation === 'pickup' && (
                <Marker 
                  key="pickup"
                  identifier="pickup"
                  coordinate={pickupLocation} 
                  title="Pickup Location" 
                />
              )}
              {dropoffLocation && selectingLocation === 'dropoff' && (
                <Marker 
                  key="dropoff"
                  identifier="dropoff"
                  coordinate={dropoffLocation} 
                  title="Dropoff Location" 
                />
              )}
            </MapView>
            <View className="absolute bottom-5 w-full px-4 flex-row justify-between">
              <CustomButton
                title="Cancel"
                handlePress={() => setShowMap(false)}
                containerStyles="flex-1 mr-2"
              />
              <CustomButton
                title="Confirm Location"
                handlePress={confirmLocation}
                containerStyles="flex-1 ml-2"
              />
            </View>
          </View>
        )}

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;