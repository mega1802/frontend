import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to store the token in AsyncStorage
const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('jwtToken', token);
    } catch (error) {
        console.error('Error saving token to AsyncStorage', error);
    }
};
const getToken = async () => {
  try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
  } catch (error) {
      console.error('Error retrieving token from AsyncStorage', error);
      return null;
  }
};


