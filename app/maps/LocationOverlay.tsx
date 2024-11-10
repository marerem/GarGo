// LocationOverlay.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import Storage from '@/app/maps/StorageMap'; // Import the Storage class
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

function LocationOverlay({  }) {
  const navigation = useNavigation();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(''); // State to hold destination address

  // Fetch destination from AsyncStorage on component mount
  useFocusEffect(React.useCallback(() => {
    const fetchDestination = async () => {
      const savedDestination = await Storage.getItem('destination');
      if (savedDestination) {
        setDestination(savedDestination); // Set destination from storage
      }
    };
    fetchDestination();
      (async () => {
        const location = await Storage.getItem('startPoint');
        if(location){
        try {
          const geocode = await Location.reverseGeocodeAsync({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          if (geocode.length > 0) {
            const { name, city, region, country } = geocode[0];
            setAddress(`${name}, ${city}, ${region}, ${country}`);
          } else {
            setAddress("Location not found");
          }
        } catch (error) {
          setAddress("Error retrieving location");
        } finally {
          setLoading(false);
        }
      }
      })();
    
  }, []));

  // Update the destination in AsyncStorage
  const handleSetDestination = async () => {
    if (destination) {
      await Storage.setItem('destination', destination); // Save destination in AsyncStorage
    }
  };

  // Navigate to TripDetailsScreen with the current destination
  const handleNavigate = () => {
    navigation.navigate('TripDetails', { });
  };

  return (
    <View style={styles.overlay}>
      {/* Current Location Section */}
      <TouchableOpacity onPress={handleNavigate}>
        <Card containerStyle={styles.locationBox}>
          <View style={styles.locationContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text style={styles.locationText}>{address || "Location not available"}</Text>
            )}
            <Icon name="location-on" type="material" color="#000" size={20} containerStyle={styles.icon} />
          </View>
        </Card>
      </TouchableOpacity>

      {/* Destination Address Display */}
      {destination ? (
        <View style={styles.destinationBox}>
          <Text style={styles.destinationText}>Destination: {destination}</Text>
        </View>
      ) : null}

      {/* Saved Locations List */}
      <View style={styles.savedLocations}>
        <LocationItem title="Geneva Airport" subtitle="Rte de l'Aéroport 21, Genève" />
        <LocationItem title="Saved places" icon="star" />
        <LocationItem title="Set location on map" icon="place"/>
        <LocationItem title="I don’t have a destination" icon="close" />
      </View>

    </View>
  );
}

function LocationItem({ title, subtitle, icon }) {
  return (
    <TouchableOpacity style={styles.locationItem}>
      <Icon name={icon || "location-pin"} type="material" size={20} />
      <View>
        <Text style={styles.locationItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.locationItemSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
  },
  locationBox: {
    borderRadius: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: 16,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  destinationBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
  },
  destinationText: {
    fontSize: 16,
  },
  savedLocations: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  locationItemTitle: {
    fontSize: 16,
    marginLeft: 10,
  },
  locationItemSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationOverlay;
