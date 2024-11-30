// storage.js (Storage Utility Class)
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  // Set an item in AsyncStorage
  static async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data to AsyncStorage', error);
    }
  }

  // Get an item from AsyncStorage
  static async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading value from AsyncStorage', error);
      return null;
    }
  }

  // Remove an item from AsyncStorage
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage', error);
    }
  }

  // Clear all data from AsyncStorage
  static async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
  }
}

export default Storage;
