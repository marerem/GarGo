// utils/locationUtils.js
import * as Location from 'expo-location';

export async function getAddressFromCoordinates(latitude, longitude) {
  try {
    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (geocode.length > 0) {
      const { name, city, region, country } = geocode[0];
      return `${name || ''}, ${city || ''}, ${region || ''}, ${country || ''}`.trim();
    } else {
      return "Location not found";
    }
  } catch (error) {
    return "Error retrieving location";
  }
}
