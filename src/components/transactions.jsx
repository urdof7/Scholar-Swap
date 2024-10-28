import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Transaction({ route, navigation }) {
  // Safely access the product with optional chaining
  const product = route?.params?.product;

  const handlePayment = () => {
    // Placeholder for payment integration logic
    console.log('Proceed to Payment');
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No product details provided.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>Product: {product.name}</Text>
      <Text style={styles.productPrice}>Price: ${product.price}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    textAlign: 'center',
  },
});
