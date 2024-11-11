import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function notifications() {
  const notifications = [
    { id: 1, message: 'Your item has been sold!' },
    { id: 2, message: 'New message from John regarding the textbook.' },
    { id: 3, message: 'Your listing has been updated.' },
    { id: 4, message: 'Reminder: Complete your transaction with Sarah.' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <ScrollView style={styles.notificationList}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',  // Black background
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFD700',  // Gold color
    marginBottom: 20,
  },
  notificationList: {
    width: '100%',
  },
  notificationItem: {
    backgroundColor: '#333',  // Dark background for each notification
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#FFD700',  // Gold border for each notification item
    borderWidth: 1,
  },
  notificationText: {
    color: '#FFD700',  // Gold color for notification text
    fontSize: 16,
  },
});
