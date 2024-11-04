// SpaceAvailabilityScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function SpaceAvailabilityScreen() {
  const navigation = useNavigation();

  // Initial state for each seat's availability
  const [seatAvailability, setSeatAvailability] = useState([
    { id: 1, available: false, position: { top: 180, left: 190 } }, // Driver's seat
    { id: 2, available: true, position: { top: 230, left: 130 } }, // Passenger seat
    { id: 3, available: true, position: { top: 230, left: 190 } }, // Back seat left
    { id: 4, available: true, position: { top: 280, left: 130 } }, // Back seat middle
    { id: 5, available: true, position: { top: 280, left: 190 } }, // Back seat right
    { id: 6, available: true, position: { top: 350, left: 130 } },  // Trunk left
    { id: 7, available: true, position: { top: 350, left: 190 } }, // Trunk right
  ]);

  // Toggle seat availability
  const toggleSeat = (id) => {
    setSeatAvailability((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === id ? { ...seat, available: !seat.available } : seat
      )
    );
  };

  const handleContinue = () => {
    navigation.navigate("ChooseOption"); // Navigate to the next screen or perform any action
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How free are you?</Text>
      <View style={styles.carContainer}>
        {/* Car Outline Image */}
        <Image source={require("../assets/images/car.png")} style={styles.carImage} />
        
        {/* Seat Positions */}
        {seatAvailability.map((seat) => (
          <TouchableOpacity
            key={seat.id}
            style={[
              styles.seat,
              seat.available ? styles.availableSeat : styles.unavailableSeat,
              seat.position,
            ]}
            onPress={() => toggleSeat(seat.id)}
          />
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  carContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  carImage: {
    width: screenWidth * 0.7, // Adjust width as necessary
    height: screenWidth * 1.2, // Adjust height as necessary
    resizeMode: 'contain',
  },
  seat: {
    width: 40,
    height: 40,
    borderRadius: 8,
    position: 'absolute',
  },
  availableSeat: {
    backgroundColor: '#4CAF50', // Green for available
  },
  unavailableSeat: {
    backgroundColor: '#FF5252', // Red for unavailable
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SpaceAvailabilityScreen;
