import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a type for the user object
interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
}

const UserList = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for errors

  // Fetch data from the API on component mount
  const fetchUsers = async () => {
    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem('jwtToken');
      
      if (!token) {
        console.log('No token found ');
        throw new Error('No token found');
       
      }

      // Fetch user data from the API
      const response = await fetch('http://192.168.0.144:3000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data); // Set users data
      setLoading(false); // Set loading to false after data is fetched
    } catch (error: any) {
      setError(error.message); // Set error message
      setLoading(false); // Set loading to false after error occurs
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId: string) => {
    router.push({
      pathname: '/create_user/update/update_user',
      params: { userId },
    });
  };

  // If data is still loading
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  // If there was an error fetching the data
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render users if data is fetched
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>{item.name}</Text>
      <Text style={styles.userText}>{item.email}</Text>
      <Text style={styles.userText}>{item.age} years old</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEdit(item._id)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/create_user/create_user')} // Navigate to the "Create User" page
      >
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default UserList;
