import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Storage from '@/app/maps/StorageMap'; // Import your Storage class

function ChooseOptionScreen() {
  const navigation = useNavigation();
  const [startPoint, setStartPoint] = useState(null);

  // Fetch the starting point from AsyncStorage on mount
  useEffect(() => {
    const fetchStartPoint = async () => {
      const storedStartPoint = await Storage.getItem('startPoint');
      if (storedStartPoint) {
        // Parse the location if needed (e.g., if it's stored as a string)
        const parsedStartPoint = typeof storedStartPoint === 'string' 
          ? JSON.parse(storedStartPoint)
          : storedStartPoint;

        setStartPoint(parsedStartPoint);
      }
    };

    fetchStartPoint();
  }, []);

  // Sample route coordinates with startPoint as the first coordinate
  const routeCoordinates = startPoint
    ? [
        { latitude: startPoint.latitude, longitude: startPoint.longitude }, // Starting point
        { latitude: 46.2098, longitude: 6.1355 }, // Midpoint
        { latitude: 46.2181, longitude: 6.1265 }, // Destination point
      ]
    : [];

  const handleConfirm = () => {
    navigation.navigate('MapsScreen');
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      {startPoint ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: startPoint.latitude,
            longitude: startPoint.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polyline coordinates={routeCoordinates} strokeColor="#000" strokeWidth={3} />
          <Marker coordinate={routeCoordinates[0]} title="Start" />
          <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="End" />
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}

      {/* Options List */}
      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Choose an option</Text>

        {/* Button to choose best options and navigate to package selection */}
        <TouchableOpacity style={styles.bestOptionsButton} onPress={() => navigation.navigate('SelectPackage')}>
          <Text style={styles.bestOptionsButtonText}>Choose Best Options</Text>
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  optionContainer: {
    position: 'absolute', // Ensure it's positioned above the map
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 10,
    alignItems: 'center',
    elevation: 5, // Shadow effect for Android
    zIndex: 1, // Bring the options above the map
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  bestOptionsButton: {
    backgroundColor: '#FFA500', // Orange color for visibility
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  bestOptionsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChooseOptionScreen;
