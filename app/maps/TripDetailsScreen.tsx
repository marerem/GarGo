// TripDetailsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { getAddressFromCoordinates } from '@/app/utils/locationUtils'; // Your utility function
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Storage from '@/app/maps/StorageMap'; // Import the Storage class

function TripDetailsScreen({  }) {
  const navigation = useNavigation();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localStartPoint, setLocalStartPoint] = useState(''); // New state for starting point
  const [localDestination, setLocalDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [lastQuery, setLastQuery] = useState(''); // Track last query
  const [activeInput, setActiveInput] = useState(''); // Track which input is active

  // Fetch the user's current address based on coordinates
  useEffect( () => {
      (async () => {
        const location = await Storage.getItem('startPoint');
        const destination = await Storage.getItem('destination');
        setLocalDestination(destination)
        setLoading(true);
        const address = await getAddressFromCoordinates(location.latitude, location.longitude);
        setAddress(address);
        setLocalStartPoint(location); // Set local start point to the current address
        setLoading(false);
      })();
    
  }, []);

  // Fetch saved destination and starting point from AsyncStorage
  useEffect(() => {
    const fetchSavedData = async () => {
      const savedStartPoint = await Storage.getItem('startPoint');
      const savedDestination = await Storage.getItem('destination');

      if (savedStartPoint) {
        setLocalStartPoint(savedStartPoint);
      }

      if (savedDestination) {
        setLocalDestination(savedDestination);
      }
    };
    //fetchSavedData();
  }, []);

  // Debounce function for input suggestions
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch location suggestions
  const fetchSuggestions = async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);

    const url = `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1&limit=5`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your.email@example.com)',
        },
      });
      const results = response.data.map((result) => ({
        id: result.place_id,
        title: result.display_name,
        location: {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        },    
      }));
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounced fetch for starting point and destination
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 3000), []);

  // Handle start point input change
  const handleStartPointChange = (text) => {
    //setLocalStartPoint(location);
    setAddress(text)
    setActiveInput('start');
    if (text !== lastQuery) {
      setLastQuery(text);
      debouncedFetchSuggestions(text); // Fetch suggestions for starting point
    }
  };

  // Handle destination input change
  const handleDestinationChange = (text) => {
    setLocalDestination(text);
    setActiveInput('destination');
    if (text !== lastQuery) {
      setLastQuery(text);
      debouncedFetchSuggestions(text); // Fetch suggestions for destination
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    if (activeInput === 'start') {
      setLocalStartPoint(suggestion.location); // Update the starting point
      setAddress(suggestion.title)
      Storage.setItem('startPoint', suggestion.location); // Save it in AsyncStorage
      Storage.setItem("startLocation", suggestion.title);
    } else {
      setLocalDestination(suggestion.title); // Update the destination
      Storage.setItem('destination', suggestion.title); // Save it in AsyncStorage
      Storage.setItem("endPoint", suggestion.location);
    }
    setSuggestions([]);
  };

  // Handle continue button click
  const handleContinue = () => {
    //setDestination(localDestination); // Set the final destination
    navigation.navigate('ChooseOption'); // Navigate to the TravelTimeScreen
  };

  return (
    <View style={styles.container}>
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

        {/* Starting Point Input Section */}
        <View style={styles.destinationBox}>
          <TextInput
            style={styles.destinationInput}
            placeholder="Enter your starting point"
            value={address}
            onChangeText={handleStartPointChange}
            onFocus={() => setActiveInput('start')}
          />
          <Icon name="search" type="material" color="#000" size={24} containerStyle={styles.icon} />
        </View>

        {/* Destination Input Section */}
        <View style={styles.destinationBox}>
          <TextInput
            style={styles.destinationInput}
            placeholder="Enter your destination address"
            value={localDestination}
            onChangeText={handleDestinationChange}
            onFocus={() => setActiveInput('destination')}
          />
          <Icon name="search" type="material" color="#000" size={24} containerStyle={styles.icon} />
        </View>

        {loadingSuggestions && <ActivityIndicator size="small" color="#0000ff" />}
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
              <Text style={styles.suggestionText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />

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
  suggestionList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  suggestionText: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
