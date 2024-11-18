import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function FrontPage({ navigation }) {
  // Sample categories and products
  const categories = ["Electronics", "Books", "Fashion", "Home", "Toys"];
  const featuredProducts = [
    {
      id: 1,
      name: "Apple iPhone 12",
      price: 799.99,
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTDlrXqfP3VWousLRXVN9HDG5-JqIppcI91kNr4a9FizfmNRz4CN-ROyGEgvcU&usqp=CAc",
    },
    {
      id: 2,
      name: "Lab Coat",
      price: 13.99,
      image:
        "https://i.ebayimg.com/thumbs/images/g/YGoAAOSwUd1kemdg/s-l1200.jpg",
    },
    {
      id: 3,
      name: "MacBook Pro",
      price: 1299.99,
      image: "https://i.ebayimg.com/images/g/ntoAAOSwIetir7mU/s-l400.jpg",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Scholar Swap</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchPlaceholder}>Search Your Class or Materials</Text>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => console.log(`Browsing ${category}`)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Popular Products</Text>
        <View style={styles.productGrid}>
          {featuredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Product", { id: product.id })}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 15,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginVertical: 25,
  },
  searchContainer: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  searchPlaceholder: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: "#FFD700",
    marginBottom: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryScroll: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  categoryButton: {
    backgroundColor: "#1C1C1C",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  categoryText: {
    color: "#FFD700",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#FFFFFF", // White background for the product cards
    padding: 10,
    borderRadius: 10,
    width: "48%", // Fits two cards per row
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light gray border for subtle separation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    color: "#333", // Dark gray for better contrast
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#666", // Medium gray for price
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
});
