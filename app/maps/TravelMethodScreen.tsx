// TravelMethodScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function TravelMethodScreen() {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const travelMethods = [
    { label: 'Walking', icon: 'directions-walk' },
    { label: 'Bike', icon: 'directions-bike' },
    { label: 'Motorbike', icon: 'two-wheeler' },
    { label: 'Car', icon: 'directions-car' },
    { label: 'Van or camper', icon: 'rv-hookup' },
    { label: 'Truck', icon: 'local-shipping' },
  ];

  const handleContinue = () => {
    // Handle the continue action, e.g., navigate to the next screen
    navigation.navigate('SpaceAvailability');
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How do you travel?</Text>
      {travelMethods.map((method) => (
        <TouchableOpacity
          key={method.label}
          style={[
            styles.methodOption,
            selectedMethod === method.label && styles.selectedMethodOption,
          ]}
          onPress={() => setSelectedMethod(method.label)}
        >
          <Icon
            name={method.icon}
            type="material"
            color={selectedMethod === method.label ? '#fff' : '#000'}
            size={24}
          />
          <Text
            style={[
              styles.methodText,
              selectedMethod === method.label && styles.selectedMethodText,
            ]}
          >
            {method.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMethodOption: {
    backgroundColor: '#4CAF50',
  },
  methodText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  selectedMethodText: {
    color: '#fff',
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

export default TravelMethodScreen;
