// LocationOverlay.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

function LocationOverlay({ location }) {
  const navigation = useNavigation();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(''); // State to hold destination address

  useEffect(() => {
    if (location) {
      (async () => {
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
      })();
    }
  }, [location]);

  return (
    <View style={styles.overlay}>
      {/* Current Location Section */}
      <TouchableOpacity onPress={() => navigation.navigate('TripDetails', { location, destination, setDestination })}>
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
        <LocationItem title="Set location on map" icon="map-marker" />
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
});

export default LocationOverlay;
