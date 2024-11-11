import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet } from 'react-native';

export default function login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(`Login with: ${email}, ${password}`);
    // Replace this with real login logic, e.g. API calls
    navigation.navigate('Home');
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
      <Text style={styles.linkText} onPress={() => console.log('Forgot Password')}>
        Forgot Password?
      </Text>
      <Text style={styles.linkText} onPress={() => navigation.navigate('SignUp')}>
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
  linkText: {
    color: '#FFD700',
    marginTop: 10,
  },
});
