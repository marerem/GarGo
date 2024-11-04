// ChooseOptionScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

function ChooseOptionScreen() {
  const navigation = useNavigation();

  // Initial state for selected option
  const [selectedOption, setSelectedOption] = useState(null);

  // Sample options
  const options = [
    { id: 1, title: '3 x small bags', price: 'CHF 2.50', time: '3 minutes variation' },
    { id: 2, title: 'Big cute lamp', price: 'CHF 1.50', time: '8 minutes variation' },
    { id: 3, title: '2 x medium bags', price: 'CHF 2.00', time: '15 minutes variation' },
  ];

  // Sample route coordinates
  const routeCoordinates = [
    { latitude: 46.2044, longitude: 6.1432 }, // Starting point
    { latitude: 46.2098, longitude: 6.1355 }, // Midpoint
    { latitude: 46.2181, longitude: 6.1265 }, // Destination point
  ];

  const handleConfirm = () => {
    // Navigate to next screen or perform an action with the selected option
    if (selectedOption) {
      // Add your logic here
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.2044,
          longitude: 6.1432,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline coordinates={routeCoordinates} strokeColor="#000" strokeWidth={3} />
        <Marker coordinate={routeCoordinates[0]} title="Start" />
        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="End" />
      </MapView>

      {/* Options List */}
      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Choose an option</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.option,
                selectedOption === item.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(item.id)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📦</Text> {/* Replace with an icon as needed */}
              </View>
              <View style={styles.optionDetails}>
                <Text style={styles.optionText}>{item.title}</Text>
                <Text style={styles.optionSubText}>{item.time}</Text>
              </View>
              <Text style={styles.optionPrice}>{item.price}</Text>
            </TouchableOpacity>
          )}
        />

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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  selectedOption: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#E8F5E9',
  },
  iconContainer: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  icon: {
    fontSize: 20,
  },
  optionDetails: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionSubText: {
    fontSize: 12,
    color: 'gray',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
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
