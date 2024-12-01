// product.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { db } from '../../firebase'; // Adjust the path if necessary
import { doc, getDoc } from 'firebase/firestore';

export default function Product({ route, navigation }) {
  const { id } = route.params;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product data from Firebase
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.productContainer}>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.productImage} />
        )}
        <Text style={styles.productName}>{product.title}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>
          Price: ${product.price ? product.price.toFixed(2) : 'N/A'}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Chat', { otherUserId: product.seller_id })
          }
        >
          <Text style={styles.buttonText}>Message Seller</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate('transactions.jsx', { product })}
        >
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0D0D0D', // Original dark background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#1C1C1C', // Original dark gray container
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', // Yellow text
    marginBottom: 10,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    color: '#FFF', // White text
    marginBottom: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700', // Yellow text
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFD700', // Yellow button
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#FF4500', // Orange button
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000', // Black text
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 24,
    color: '#FFD700', // Yellow text
    textAlign: 'center',
  },
});
