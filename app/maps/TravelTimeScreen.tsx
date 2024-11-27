// TravelTimeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function TravelTimeScreen() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('later'); // Default to "later"
  const [currentTime, setCurrentTime] = useState({
    hours: '',
    minutes: '',
    day: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    // Initialize current time
    const now = new Date();
    setCurrentTime({
      hours: now.getHours().toString().padStart(2, '0'),
      minutes: now.getMinutes().toString().padStart(2, '0'),
      day: now.getDate().toString().padStart(2, '0'),
      month: (now.getMonth() + 1).toString().padStart(2, '0'),
      year: now.getFullYear().toString(),
    });
  }, []);

  const handleContinue = () => {
    navigation.navigate('TravelMethod');
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>When are you travelling?</Text>

      {/* Now Section */}
      <TouchableOpacity
        style={[
          styles.section,
          selectedOption === 'now' ? styles.selectedSection : styles.unselectedSection,
        ]}
        onPress={() => setSelectedOption('now')}
      >
        <Icon name="timer" type="material" color={selectedOption === 'now' ? "#fff" : "#000"} size={28} />
        <Text style={[styles.sectionText, selectedOption === 'now' && styles.whiteText]}>Now</Text>
      </TouchableOpacity>

      {/* Later Section */}
      <TouchableOpacity
        style={[
          styles.section,
          styles.timeSection,
          selectedOption === 'later' ? styles.selectedSection : styles.unselectedSection,
        ]}
        onPress={() => setSelectedOption('later')}
      >
        <Icon name="calendar-today" type="material" color={selectedOption === 'later' ? "#fff" : "#000"} size={28} />
        <Text style={[styles.sectionText, selectedOption === 'later' && styles.whiteText]}>Later</Text>
        <View style={styles.dateTimeContainer}>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{currentTime.hours}</Text>
            <Text style={styles.timeText}>:</Text>
            <Text style={styles.timeText}>{currentTime.minutes}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.timeText}>{currentTime.day}</Text>
            <Text style={styles.timeText}>{currentTime.month}</Text>
            <Text style={styles.timeText}>{currentTime.year}</Text>
          </View>
        </View>
      </TouchableOpacity>

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
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedSection: {
    backgroundColor: '#4CAF50',
  },
  unselectedSection: {
    backgroundColor: '#fff',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  whiteText: {
    color: '#fff',
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeText: {
    fontSize: 18,
    color: '#4CAF50',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginHorizontal: 4,
    fontWeight: 'bold',
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

export default TravelTimeScreen;
