import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsMenu() {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ backgroundColor: 'white', borderRadius: 10, marginBottom: 16, marginHorizontal: 16 }}>
        
        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('PersonalInformation')}
        >
          <Text style={styles.optionText}>Personal Information</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('MyDocuments')}
        >
          <Text style={styles.optionText}>My Documents</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('BankingInformation')}
        >
          <Text style={styles.optionText}>Banking Information</Text>
        </TouchableOpacity>

        {/* Modify the Password button to navigate to ChangePassword */}
        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('Password')}
        >
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('InviteAFriend')}
        >
          <Text style={styles.optionText}>Invite a Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionContainer} 
          onPress={() => navigation.navigate('PublicProfile')}
        >
          <Text style={styles.optionText}>See My Public Profile</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = {
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
  },
};
