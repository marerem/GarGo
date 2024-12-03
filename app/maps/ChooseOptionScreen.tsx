import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Storage from '@/app/maps/StorageMap'; // Import your Storage class
import Package, { PackageStatus, Volume } from "@/lib/backend/packages";
import { Query } from "react-native-appwrite";
import Delivery from "@/lib/backend/delivery"
import { useAuthContext } from '@/context/AuthProvider'

function ChooseOptionScreen() {
  const navigation = useNavigation();
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const user = useAuthContext();

  const [selectedPackage, setSelectedPackage] = useState(null);

  // Fetch the starting point from AsyncStorage on mount
  useEffect(() => {
    const fetchStartPointAndPackages = async () => {
      const storedStartPoint = await Storage.getItem('startPoint');
      const storedEndPoint = await Storage.getItem('endPoint');
      if (storedStartPoint && storedEndPoint) {
        const parsedStartPoint = typeof storedStartPoint === 'string' 
          ? JSON.parse(storedStartPoint)
          : storedStartPoint;

        setStartPoint(parsedStartPoint);
        setEndPoint(storedEndPoint);

        // Fetch packages and find the closest one
        const packages = await Package.getPackages([Query.equal('status', [PackageStatus.Pending]),Query.notEqual('senderID', user.user['$id'])]);
        const closestPackage = findClosestPackage(parsedStartPoint, storedEndPoint, packages);
        setSelectedPackage(closestPackage);
      }
    };

    fetchStartPointAndPackages();
  }, []);

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Find the closest package
  const findClosestPackage = (startPoint, endPoint, packages) => {
    if (!startPoint || packages.length === 0) return null;

    let closestPackage = null;
    let minDistance = Infinity;

    packages.forEach((pkg) => {
      if (pkg.src_lang && pkg.src_long && pkg.dest_lang && pkg.dest_long) {
        const startToSourceDistance = calculateDistance(
          startPoint.latitude,
          startPoint.longitude,
          pkg.src_lang,
          pkg.src_long
        );
        const endToDestinationDistance = calculateDistance(
          pkg.dest_lang,
          pkg.dest_long,
          endPoint.latitude,
          endPoint.longitude // Example destination point
        );

        const totalDistance = startToSourceDistance + endToDestinationDistance;
        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          closestPackage = pkg;
        }
      }
    });

    return closestPackage;
  };

  // Sample route coordinates with startPoint as the first coordinate
  const routeCoordinates = startPoint && endPoint && selectedPackage
    ? [
        { latitude: startPoint.latitude, longitude: startPoint.longitude }, // Starting point
        { latitude: selectedPackage?.src_lang, longitude: selectedPackage?.src_long }, // Package source point
        { latitude: selectedPackage?.dest_lang, longitude: selectedPackage?.dest_long }, // Package destination point
        { latitude: endPoint?.latitude, longitude: endPoint?.longitude }, // Package destination point

      ]
    : [];

    const handleConfirm = async () => {
      if (selectedPackage) {
        try {
          const p = new Delivery();
    
          // Fetch destination and source locations
          const destination = await Storage.getItem('destination'); // Async storage call
          const startLocation = await Storage.getItem('startLocation'); // Async storage call
          // Set destination and source locations
          p.setDestinationLocation(endPoint?.latitude, endPoint?.longitude, destination);

          p.setSourceLocation(startPoint.latitude, startPoint.longitude, startLocation);
          // Create a new delivery
          await p.create(selectedPackage.id);


          // Fetch packages (since it's async, you must await it)
          const packages = await Package.getPackages([Query.equal('$id', [selectedPackage.id])]);

    
          if (packages && packages.length > 0) {
            // Update the package status
            packages[0].setStatus(PackageStatus.InTransit);
            //console.log(user, user.user['$id']);
            packages[0].setDeliverID(user.user['$id'])
            //throw new Error("Something went wrong!");
            //packages[0].setDeliverId();
            await packages[0].update(); // Assuming this is also an async call
          }
        } catch (error) {
          console.error("Error in handleConfirm:", error); // Log any errors
        }
      }
    
      // Navigate to the next screen
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
          {startPoint && endPoint && selectedPackage && (
          
            <>
            <Marker coordinate={routeCoordinates[0]} title="Start" />

              <Marker coordinate={routeCoordinates[1]} title="Package Source" />
              <Marker coordinate={routeCoordinates[2]} title="Package Destination" />
              <Marker coordinate={routeCoordinates[3]} title="Package Destination" />

            </>
          )}
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
