// Maps.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import LocationOverlay from '@/app/maps/LocationOverlay';  // Adjust path according to your project structure
import Storage from '@/app/maps/StorageMap'; // Import the Storage class
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TripDetailsScreen from '@/app/maps/TripDetailsScreen';
import TravelTimeScreen from '@/app/maps/TravelTimeScreen';
import TravelMethodScreen from '@/app/maps/TravelMethodScreen';
import SpaceAvailabilityScreen from '@/app/maps/SpaceAvailabilityScreen';
import ChooseOptionScreen from '@/app/maps/ChooseOptionScreen';
import SelectPackageScreen from '@/app/maps/SelectPackageScreen';
import { useFocusEffect } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function MapsScreen({ navigation }) {
  const [location, setLocation] = useState(null);

  // Fetch the user's location and store it in AsyncStorage
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      if (!location) {
      let currentLocation = await Location.getCurrentPositionAsync({});
      if(currentLocation){
      setLocation(currentLocation.coords);
      // Store the location in AsyncStorage
      Storage.setItem('startPoint', currentLocation.coords);
      }
      }
    })();
  }, []);

  // Retrieve the saved location from AsyncStorage
  useFocusEffect(React.useCallback(() => {
    const fetchSavedLocation = async () => {
      const savedLocation = await Storage.getItem('startPoint');
      if (savedLocation) {
        setLocation(savedLocation);
      }
    };
    fetchSavedLocation();
  }, []));

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location ? location.latitude : 46.2044,
          longitude: location ? location.longitude : 6.1432,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
      >
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        )}
      </MapView>

      {/* Pass location and navigation to LocationOverlay */}
      <LocationOverlay navigation={navigation} />
    </View>
  );
}

// Main App with Stack Navigation
export default function Maps() {
  return (
    <NavigationContainer>

    <Stack.Navigator initialRouteName="MapsScreen">
      <Stack.Screen 
        name="MapsScreen" 
        component={MapsScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="TripDetails" 
        component={TripDetailsScreen} 
        options={{ title: 'Your Trip' }} 
      />
      <Stack.Screen name="TravelTime" component={TravelTimeScreen} options={{ title: 'Travel Time' }} />
      <Stack.Screen name="TravelMethod" component={TravelMethodScreen} options={{ title: 'Travel Method' }} />
      <Stack.Screen name="SpaceAvailability" component={SpaceAvailabilityScreen} options={{ title: 'Space Availability' }} />
      <Stack.Screen name="ChooseOption" component={ChooseOptionScreen} options={{ title: 'Choose Option' }} />
      <Stack.Screen name="SelectPackage" component={SelectPackageScreen} />
    </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
