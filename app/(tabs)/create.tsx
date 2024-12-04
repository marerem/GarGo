import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import { icons } from "../../constants";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { useAuthContext } from "@/context/AuthProvider";
import Package, { Volume } from "@/lib/backend/packages";

const Create = () => {
  const { user } = useAuthContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    weight: 0,
    volume: Volume.S,
    images: [],
    pickup: "",
    dropoff: "",
  });
  
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [selectingLocation, setSelectingLocation] = useState('pickup');
  const [displayAddresses, setDisplayAddresses] = useState({
    pickup: '',
    dropoff: ''
  });
  const [showAddressInput, setShowAddressInput] = useState<'pickup' | 'dropoff' | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultiple: true,
    });

    if (!result.canceled) {
      // Convert images to the format expected by Package class
      const formattedImages = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'image/jpeg',
        size: asset.fileSize || 0,
      }));

      setForm({
        ...form,
        images: [...form.images, ...formattedImages],
      });
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant camera permission to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Convert image to the format expected by Package class
      const formattedImage = {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        size: result.assets[0].fileSize || 0,
      };

      setForm({
        ...form,
        images: [...form.images, formattedImage],
      });
    }
  };

  const handleVolumeSelect = (volume: Volume) => {
    setForm({
      ...form,
      volume
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      weight: 0,
      volume: Volume.S,
      images: [],
      pickup: "",
      dropoff: "",
    });
    setPickupLocation(null);
    setDropoffLocation(null);
    setDisplayAddresses({
      pickup: '',
      dropoff: ''
    });
    setSelectingLocation('pickup');
  };

  const submit = async () => {
    if (!user) {
      return Alert.alert("Error", "You must be logged in to create a package");
    }

    setUploading(true);
    try {
      const parcal = new Package();
      
      // Set package info
      parcal.setInfo(
        form.title,
        form.description,
        form.weight,
        form.volume
      );

      // Set locations
      if (pickupLocation) {
        parcal.setSourceLocation(
          pickupLocation.latitude,
          pickupLocation.longitude,
          displayAddresses.pickup
        );
      }

      if (dropoffLocation) {
        parcal.setDestinationLocation(
          dropoffLocation.latitude,
          dropoffLocation.longitude,
          displayAddresses.dropoff
        );
      }

      // Explicitly set deliverID to null
      parcal.deliverID = null;

      // Create package with images
      await parcal.create(user.$id, form.images);

      Alert.alert("Success", "Package created successfully");
      resetForm(); // Reset the form after successful submission
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
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

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (results.length > 0) {
        const address = results[0];
        return `${address.street || ''} ${address.name || ''}, ${address.city || ''}`;
      }
      return 'Address not found';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Address not found';
    }
  };

  const handleLocationSelect = async (type: 'pickup' | 'dropoff') => {
    setSelectingLocation(type);
    
    if (!pickupLocation && !dropoffLocation) {
      const location = await getCurrentLocation();
      if (location) {
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        
        if (type === 'pickup') {
          setPickupLocation(currentLocation);
          // Get and set the display address
          const address = await getAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude);
          setDisplayAddresses(prev => ({
            ...prev,
            pickup: address
          }));
          // Save IP format in form state
          setForm(prev => ({
            ...prev,
            pickup: coordinatesToIP(currentLocation.latitude, currentLocation.longitude)
          }));
        } else {
          setDropoffLocation(currentLocation);
          // Get and set the display address
          const address = await getAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude);
          setDisplayAddresses(prev => ({
            ...prev,
            dropoff: address
          }));
          // Save IP format in form state
          setForm(prev => ({
            ...prev,
            dropoff: coordinatesToIP(currentLocation.latitude, currentLocation.longitude)
          }));
        }
      }
    }
  };

  const handleMapPress = async (e: any) => {
    const newLocation = e.nativeEvent.coordinate;
    
    if (selectingLocation === 'pickup') {
      setPickupLocation(newLocation);
      // Get and set the display address
      const address = await getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
      setDisplayAddresses(prev => ({
        ...prev,
        pickup: address
      }));
      // Save IP format in form state
      setForm(prev => ({
        ...prev,
        pickup: coordinatesToIP(newLocation.latitude, newLocation.longitude)
      }));
    } else {
      setDropoffLocation(newLocation);
      // Get and set the display address
      const address = await getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
      setDisplayAddresses(prev => ({
        ...prev,
        dropoff: address
      }));
      // Save IP format in form state
      setForm(prev => ({
        ...prev,
        dropoff: coordinatesToIP(newLocation.latitude, newLocation.longitude)
      }));
    }
  };

  const coordinatesToIP = (latitude: number, longitude: number): string => {
    // Convert to positive integers and take last octet
    const lat = Math.abs(Math.floor(latitude * 100)) % 256;
    const long = Math.abs(Math.floor(longitude * 100)) % 256;
    
    // Create a simple IP-like format
    return `192.168.${lat}.${long}`;
  };

  const handleManualAddressSearch = async () => {
    if (!manualAddress.trim()) return;

    try {
      const results = await Location.geocodeAsync(manualAddress);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newLocation = { latitude, longitude };
        
        if (showAddressInput === 'pickup') {
          setPickupLocation(newLocation);
          setDisplayAddresses(prev => ({
            ...prev,
            pickup: manualAddress
          }));
          setForm(prev => ({
            ...prev,
            pickup: coordinatesToIP(latitude, longitude)
          }));
        } else {
          setDropoffLocation(newLocation);
          setDisplayAddresses(prev => ({
            ...prev,
            dropoff: manualAddress
          }));
          setForm(prev => ({
            ...prev,
            dropoff: coordinatesToIP(latitude, longitude)
          }));
        }
        
        setShowAddressInput(null);
        setManualAddress('');
      } else {
        Alert.alert('Address not found', 'Please try a different address');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find address');
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Create Package</Text>

        {/* Package Title */}
        <FormField
          title="Package Title"
          value={form.title}
          placeholder="Give your package a title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-7"
        />

        {/* Location Selection Controls */}
        <View className="mt-7 flex-row space-x-2">
          <TouchableOpacity 
            onPress={() => handleLocationSelect('pickup')}
            className={`flex-1 flex-row items-center justify-between bg-black-100 p-4 rounded-lg ${
              selectingLocation === 'pickup' ? 'border-2 border-secondary-100' : ''
            }`}
          >
            <Text className="text-gray-100 font-pmedium flex-1 mr-2">
              {displayAddresses.pickup || 'Pickup Location'}
            </Text>
            <MaterialIcons name="location-on" size={24} color={selectingLocation === 'pickup' ? '#00ff00' : '#fff'} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleLocationSelect('dropoff')}
            className={`flex-1 flex-row items-center justify-between bg-black-100 p-4 rounded-lg ${
              selectingLocation === 'dropoff' ? 'border-2 border-secondary-100' : ''
            }`}
          >
            <Text className="text-gray-100 font-pmedium flex-1 mr-2">
              {displayAddresses.dropoff || 'Dropoff Location'}
            </Text>
            <MaterialIcons name="location-on" size={24} color={selectingLocation === 'dropoff' ? '#ff0000' : '#fff'} />
          </TouchableOpacity>
        </View>

        {/* Map View */}
        <View className="mt-4">
          <MapView
            className="w-full h-80 rounded-lg"
            initialRegion={{
              latitude: pickupLocation?.latitude || 46.2044,
              longitude: pickupLocation?.longitude || 6.1432,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            onPress={handleMapPress}
          >
            {pickupLocation && (
              <Marker 
                key="pickup"
                identifier="pickup"
                coordinate={pickupLocation} 
                title="Pickup Location"
                pinColor="green" 
              />
            )}
            {dropoffLocation && (
              <Marker 
                key="dropoff"
                identifier="dropoff"
                coordinate={dropoffLocation} 
                title="Dropoff Location"
                pinColor="red"
              />
            )}
          </MapView>
        </View>

        <FormField
          title="Description"
          value={form.description}
          placeholder="Describe your package..."
          handleChangeText={(e) => setForm({ ...form, description: e })}
          otherStyles="mt-7"
          multiline
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Package Images
          </Text>

          {/* Display selected images */}
          <View className="flex-row flex-wrap gap-2">
            {form.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                className="w-20 h-20 rounded"
              />
            ))}
          </View>

          {/* Image Upload Buttons */}
          <View className="flex-row space-x-2">
            <TouchableOpacity 
              onPress={openImagePicker}
              className="flex-1 h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2"
            >
              <Image
                source={icons.upload}
                resizeMode="contain"
                className="w-5 h-5"
              />
              <Text className="text-sm text-gray-100 font-pmedium">
                Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={openCamera}
              className="flex-1 h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2"
            >
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
              <Text className="text-sm text-gray-100 font-pmedium">
                Camera
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Weight (kg)
          </Text>
          <FormField
            value={form.weight.toString()}
            placeholder="Enter weight in kg..."
            handleChangeText={(value) => {
              // Only allow positive integers
              const numericValue = value.replace(/[^0-9]/g, '');
              setForm({ 
                ...form, 
                weight: numericValue ? parseInt(numericValue) : 0 
              });
            }}
            keyboardType="numeric"
            otherStyles="mt-2"
          />
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Volume
          </Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {Object.values(Volume).map((volume) => (
              <TouchableOpacity
                key={volume}
                onPress={() => handleVolumeSelect(volume)}
                className={`w-12 h-12 rounded-lg ${
                  form.volume === volume ? 'bg-secondary-100' : 'bg-black-100'
                } justify-center items-center mr-3`}
              >
                <Text className="text-white font-pmedium text-sm">{volume}</Text>
                <Text className="text-gray-300 text-[8px] mt-0.5">
                  {volume === Volume.S ? 'Small' : 
                   volume === Volume.M ? 'Medium' : 
                   volume === Volume.L ? 'Large' : 
                   volume === Volume.XL ? 'Extra Large' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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
