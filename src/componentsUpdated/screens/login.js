import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext); // Auth context
  const [user, setUser] = useState(null);

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      setUser(response);
      console.log('Google Login Success:', response);
    },
    onError: (error) => console.log('Google Login Failed:', error),
  });

  useEffect(() => {
    if (user) {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Google User Profile:', data);
          signIn(); // Update global sign-in state
          navigation.navigate('Home'); // Navigate to Home screen
        })
        .catch((err) => console.log('Error fetching user info:', err));
    }
  }, [user, navigation, signIn]);

  const handleLogin = () => {
    if (email === 'test@example.com' && password === 'password') {
      signIn(); // Update global sign-in state
      navigation.navigate('Home'); // Navigate to Home screen
    } else {
      console.log('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Scholar Swap</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity style={styles.googleButton} onPress={googleLogin}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <Text
        style={styles.linkText}
        onPress={() => navigation.navigate('Signup')}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#FFD700',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#FFD700',
    marginBottom: 15,
  },
  googleButton: {
    marginTop: 20,
    backgroundColor: '#4285F4',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    color: '#FFD700',
    marginTop: 10,
  },
});
