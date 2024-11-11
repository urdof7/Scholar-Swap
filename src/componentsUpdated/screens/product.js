import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function product() {
  const navigation = useNavigation();

  // Fake product data
  const fakeProducts = [
    { id: 1, name: 'Introduction to Algorithms', description: 'A comprehensive book on algorithms.', price: 59.99 },
    { id: 2, name: 'Data Structures and Algorithms in Python', description: 'Learn data structures in Python.', price: 45.50 },
    { id: 3, name: 'Clean Code', description: 'A Handbook of Agile Software Craftsmanship.', price: 39.99 },
    { id: 4, name: 'The Pragmatic Programmer', description: 'Your journey to mastery.', price: 49.99 },
    { id: 5, name: 'Design Patterns: Elements of Reusable Object-Oriented Software', description: 'A book on software design patterns.', price: 54.99 },
    { id: 6, name: 'The Art of Computer Programming', description: 'A collection of books on algorithms and mathematical computing.', price: 199.99 },
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simulate fetching product data from an API
    setTimeout(() => {
      setProducts(fakeProducts);
    }, 1000); // Simulating a delay
  }, []);

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.productPrice}>Price: ${product.price}</Text>

          <TouchableOpacity style={styles.button} onPress={() => console.log('Messaging Seller')}>
            <Text style={styles.buttonText}>Message Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate('transactions.jsx', { product })}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 24,
    color: '#FFD700',
    textAlign: 'center',
  },
});
