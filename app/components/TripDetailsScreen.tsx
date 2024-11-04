// TripDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { getAddressFromCoordinates } from '@/utils/locationUtils';
import { useNavigation } from '@react-navigation/native';

function TripDetailsScreen({ route }) {
  const navigation = useNavigation();
  const { location, destination, setDestination } = route.params;
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localDestination, setLocalDestination] = useState(destination); // Local state for TextInput

  useEffect(() => {
    if (location) {
      (async () => {
        setLoading(true);
        const address = await getAddressFromCoordinates(location.latitude, location.longitude);
        setAddress(address);
        setLoading(false);
      })();
    }
  }, [location]);

  const handleContinue = () => {
    setDestination(localDestination); // Update the main destination state
    navigation.navigate('TravelTime'); // Navigate to the TravelTimeScreen
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Current Location Section */}
        <View style={styles.locationBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.locationText}>
              {address || "Location not available"}
            </Text>
          )}
          <Icon name="location-on" type="material" color="#000" size={24} containerStyle={styles.icon} />
        </View>

        {/* Destination Address Input Section */}
        <View style={styles.destinationBox}>
          <TextInput
            style={styles.destinationInput}
            placeholder="Enter your destination address"
            value={localDestination}
            onChangeText={setLocalDestination} // Update the local state
          />
          <Icon name="search" type="material" color="#000" size={24} containerStyle={styles.icon} />
        </View>

        {/* Button to Continue to TravelTimeScreen */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
  destinationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  destinationInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TripDetailsScreen;
