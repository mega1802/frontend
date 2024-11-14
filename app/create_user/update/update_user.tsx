import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter , useLocalSearchParams} from 'expo-router';


const EditUser: React.FC = () => {
  const router = useRouter();
 // const userId = router.query.userId as string; // Access userId from URL params
 const { query } = useLocalSearchParams();
 const userId = Array.isArray(query.userId) ? query.userId[0] : query.userId;
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://192.168.0.144:3000/api/users/${userId}`);
        const data = await response.json();

        if (data.success) {
          const { name, age, email, password } = data.data;
          setUser(data.data);
          setName(name);
          setAge(age.toString());
          setEmail(email);
          setPassword(password);
        } else {
          Alert.alert('Error', 'User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdateUser = async () => {
    if (!name || !age || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const updatedUser = { name, age: parseInt(age, 10), email, password };

    try {
      const response = await fetch(`http://192.168.0.144:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'User updated successfully');
        
        // Trigger a re-fetch in UserList (could also use Context or pass data back)
        router.push('/home'); // Navigate back to the UserList after updating
      } else {
        Alert.alert('Error', 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Error updating user');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
        <Text style={styles.buttonText}>Update User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loader: {
    marginTop: 50,
  },
});

export default EditUser;
