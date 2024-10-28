import React, { useState } from "react";
import { TextInput, Button, View, Text, StyleSheet } from "react-native";

export default function Search() {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handleSearch = () => {
    console.log(`Searching for ${query} within price range ${priceRange}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for Materials</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for materials"
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
      />

      <Text style={styles.filterText}>Filter by Price</Text>

      {/* Placeholder for price range slider */}
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: "#FFD700",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 10,
    color: "#FFD700",
    marginBottom: 15,
  },
  filterText: {
    color: "#FFD700",
    marginBottom: 10,
  },
});
