// SelectPackageScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function SelectPackageScreen() {
  const navigation = useNavigation();

  // Sample package data
  const packages = [
    { id: 1, title: 'Small Package', description: 'Lightweight and easy to carry', price: 'CHF 2.50' },
    { id: 2, title: 'Medium Package', description: 'Suitable for small items', price: 'CHF 5.00' },
    { id: 3, title: 'Large Package', description: 'Perfect for bulky items', price: 'CHF 10.00' },
  ];

  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleConfirm = () => {
    if (selectedPackage) {
      console.log(`Selected package: ${selectedPackage}`);
      navigation.goBack(); // Navigate back to the ChooseOptionScreen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Package</Text>

      <FlatList
        data={packages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.package,
              selectedPackage === item.id && styles.selectedPackage,
            ]}
            onPress={() => setSelectedPackage(item.id)}
          >
            <View style={styles.packageDetails}>
              <Text style={styles.packageTitle}>{item.title}</Text>
              <Text style={styles.packageDescription}>{item.description}</Text>
              <Text style={styles.packagePrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  package: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPackage: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#E8F5E9',
  },
  packageDetails: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  packageDescription: {
    fontSize: 12,
    color: 'gray',
  },
  packagePrice: {
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
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectPackageScreen;
