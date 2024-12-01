import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the correct package
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Adjust the import path as needed
import { doc, setDoc } from 'firebase/firestore';

export default function Signup({ navigation }) {
  // State variables for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Default Profile Picture URL
  const DEFAULT_PROFILE_PICTURE = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  // Handle Sign Up button press
  const handleSignUp = async () => {
    if (
      !firstName ||
      !lastName ||
      !academicYear ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore with default profile picture
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        academicYear,
        email,
        profilePicture: DEFAULT_PROFILE_PICTURE, // Set to default profile picture
        createdAt: new Date(),
      });

      // Navigate to Front screen or Login screen
      navigation.navigate('FrontPage');
    } catch (error) {
      // Handle errors here
      console.error('Error during sign up:', error);
      Alert.alert('Sign Up Error', error.message);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://your-logo-url.com' }} // Replace with your actual logo URL
        />
      </View>

      {/* Sign-Up Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#666"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#666"
          value={lastName}
          onChangeText={setLastName}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={academicYear}
            style={styles.picker}
            onValueChange={(itemValue) => setAcademicYear(itemValue)}
          >
            <Picker.Item label="Academic Year" value="" />
            <Picker.Item label="Freshman" value="Freshman" />
            <Picker.Item label="Sophomore" value="Sophomore" />
            <Picker.Item label="Junior" value="Junior" />
            <Picker.Item label="Senior" value="Senior" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('Login')} // Navigate to Login screen
        >
          Already have an account? Log In
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#222', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF', // White form background
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
  },
  pickerContainer: {
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  linkText: {
    color: '#FFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
