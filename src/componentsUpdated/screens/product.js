import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { db, auth } from '../../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'firebase/firestore';

export default function Product({ route, navigation }) {
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new Animated.Value(0))[0];

  const userId = auth.currentUser?.uid;

  useEffect(() => {
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

    const checkBookmark = async () => {
      try {
        if (userId) {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const bookmarks = userSnap.data().bookmarked_products || [];
            setIsBookmarked(bookmarks.includes(id));
          }
        }
      } catch (error) {
        console.error('Error checking bookmarks:', error);
      }
    };

    fetchProduct();
    checkBookmark();
  }, [id, userId]);

  const showToast = (message) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const toggleBookmark = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { bookmarked_products: [] });
      }

      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarked_products: arrayRemove(id),
        });
        setIsBookmarked(false);
        showToast('Removed from Bookmarks');
      } else {
        await updateDoc(userRef, {
          bookmarked_products: arrayUnion(id),
        });
        setIsBookmarked(true);
        showToast('Added to Bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

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
        <View style={styles.header}>
          {product.image && (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          )}
          <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkIcon}>
            <View style={styles.bookmarkContainer}>
              <View
                style={[
                  styles.bookmarkBody,
                  isBookmarked ? styles.bookmarked : styles.notBookmarked,
                ]}
              />
              <View style={styles.bookmarkCutout} />
            </View>
          </TouchableOpacity>
        </View>
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

      <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0D0D0D', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#1C1C1C', // Dark gray container
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bookmarkContainer: {
    position: 'relative',
    width: 24,
    height: 36,
  },
  bookmarkBody: {
    width: 24,
    height: 36,
  },
  bookmarked: {
    backgroundColor: '#FFD700', // Gold when bookmarked
  },
  notBookmarked: {
    backgroundColor: '#555', // Gray when not bookmarked
  },
  bookmarkCutout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1C1C1C', // Matches productContainer background
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
  toast: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#FFF',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 24,
    color: '#FFD700', // Yellow text
    textAlign: 'center',
  },
});
