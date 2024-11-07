// Maps.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import LocationOverlay from '@/components/LocationOverlay';
import TripDetailsScreen from '@/components/TripDetailsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TravelTimeScreen from '@/components/TravelTimeScreen';
import TravelMethodScreen from '@/components/TravelMethodScreen';
import SpaceAvailabilityScreen from '@/components/SpaceAvailabilityScreen';
import ChooseOptionScreen from '@/components/ChooseOptionScreen';
import SelectPackageScreen from '@/components/SelectPackageScreen'


const Stack = createNativeStackNavigator();

function MapsScreen({ navigation }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

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
      <LocationOverlay location={location} navigation={navigation} />
    </View>
  );
}

export default function Maps() {
  return (
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
      <Stack.Screen name="ChooseOption" component={ChooseOptionScreen} options={react-native-maps{ title: 'Choose Option' }} />
      <Stack.Screen name="SelectPackage" component={SelectPackageScreen} />

    </Stack.Navigator>react-native-maps
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
