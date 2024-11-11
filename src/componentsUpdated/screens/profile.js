import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function profile() {
  const handleEditProfile = () => {
    console.log('Editing Profile');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://your-logo-url.com' }} // Replace with actual logo URL
        />
        <View style={styles.navLinks}>
          <Text style={styles.navLink}>Buy</Text>
          <Text style={styles.navLink}>Sell</Text>
          <Text style={styles.navLink}>About Us</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://your-image-url.com' }} // Replace with actual profile image URL
          />
          <Text style={styles.profileName}>Christina Tran</Text>
          <Text style={styles.universityInfo}>Wake Forest University</Text>
          <Text style={styles.classInfo}>Class of 2025</Text>
        </View>

        {/* Chat Section */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Chats</Text>
          {['Johnny', 'Emma', 'Brayden', 'Thomas'].map((name) => (
            <View key={name} style={styles.chatItem}>
              <Text style={styles.chatName}>{name}</Text>
              <Text style={styles.chatTime}>5:50 pm</Text>
            </View>
          ))}
        </View>

        {/* Tabs for Listed Products and Order History */}
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Your Listed Products</Text>
          <Text style={styles.tab}>Your Order History</Text>
        </View>

        {/* Product Listings */}
        <View style={styles.productList}>
          {Array(5).fill().map((_, index) => (
            <View key={index} style={styles.productItem}>
              <Image
                style={styles.productImage}
                source={{ uri: 'https://product-image-url.com' }} // Replace with actual product image URL
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>Lab Coat</Text>
                <Text style={styles.productPrice}>$9.99</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#222', // Dark background
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#000', // Black background for nav bar
  },
  logo: {
    width: 40,
    height: 40,
  },
  navLinks: {
    flexDirection: 'row',
  },
  navLink: {
    fontSize: 18,
    color: '#FFD700', // Gold text
    marginHorizontal: 15,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
  },
  universityInfo: {
    fontSize: 16,
    color: '#CCC',
  },
  classInfo: {
    fontSize: 14,
    color: '#AAA',
  },
  chatSection: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  chatName: {
    fontSize: 16,
    color: '#FFF',
  },
  chatTime: {
    fontSize: 14,
    color: '#777',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  tab: {
    fontSize: 16,
    color: '#FFD700',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#FFD700',
  },
  productList: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: '#FFF',
  },
  productPrice: {
    fontSize: 14,
    color: '#AAA',
  },
});
