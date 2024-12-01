// chat.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { auth, db } from '../../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

export default function Chat({ route, navigation }) {
  const { otherUserId } = route.params;
  const [currentUserId, setCurrentUserId] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  // Fetch current user's ID
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    } else {
      // User is signed out
      navigation.navigate('Login');
    }
  }, [navigation]);

  // Generate a consistent conversationId
  const conversationId =
    currentUserId && otherUserId
      ? [currentUserId, otherUserId].sort().join('_')
      : null;

  // Fetch other user's name
  useEffect(() => {
    const fetchOtherUserName = async () => {
      try {
        const otherUserDocRef = doc(db, 'users', otherUserId);
        const otherUserDoc = await getDoc(otherUserDocRef);
        if (otherUserDoc.exists()) {
          const data = otherUserDoc.data();
          setOtherUserName(`${data.firstName} ${data.lastName}`);
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchOtherUserName();
  }, [otherUserId]);

  // Fetch messages and listen for real-time updates
  useEffect(() => {
    if (!currentUserId || !conversationId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('sent_time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({ id: doc.id, ...data });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUserId, conversationId]);

  // Update read_time for received messages
  useEffect(() => {
    const updateReadTime = async () => {
      messages.forEach(async (message) => {
        if (message.receiver_id === currentUserId && !message.read_time) {
          const messageRef = doc(db, 'messages', message.id);
          await updateDoc(messageRef, {
            read_time: serverTimestamp(),
          });
        }
      });
    };
    updateReadTime();
  }, [messages, currentUserId]);

  // Send a new message
  const sendMessage = async () => {
    if (messageText.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        sender_id: currentUserId,
        receiver_id: otherUserId,
        message: messageText,
        sent_time: serverTimestamp(),
        read_time: null,
        conversationId: conversationId,
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Render each message
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender_id === currentUserId;
    const isSelfMessage =
      item.sender_id === currentUserId && item.receiver_id === currentUserId;

    if (isSelfMessage) {
      // Display the message twice: once as sent and once as received
      return (
        <>
          <View style={[styles.messageContainer, styles.currentUserContainer]}>
            <View style={[styles.messageBubble, styles.currentUserBubble]}>
              <Text style={[styles.messageText, styles.currentUserText]}>
                {item.message}
              </Text>
              <Text style={styles.messageTime}>
                {item.sent_time
                  ? item.sent_time.toDate().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </Text>
            </View>
          </View>
          <View style={[styles.messageContainer, styles.otherUserContainer]}>
            <View style={[styles.messageBubble, styles.otherUserBubble]}>
              <Text style={[styles.messageText, styles.otherUserText]}>
                {item.message}
              </Text>
              <Text style={styles.messageTime}>
                {item.sent_time
                  ? item.sent_time.toDate().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </Text>
            </View>
          </View>
        </>
      );
    } else {
      return (
        <View
          style={[
            styles.messageContainer,
            isCurrentUser
              ? styles.currentUserContainer
              : styles.otherUserContainer,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isCurrentUser
                ? styles.currentUserBubble
                : styles.otherUserBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser
                  ? styles.currentUserText
                  : styles.otherUserText,
              ]}
            >
              {item.message}
            </Text>
            <Text style={styles.messageTime}>
              {item.sent_time
                ? item.sent_time.toDate().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with other user's name */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{otherUserName}</Text>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Original dark background
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#1C1C1C', // Dark gray header
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFD700', // Yellow text
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#0D0D0D', // Match background color
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
  },
  currentUserBubble: {
    backgroundColor: '#007AFF', // Blue for sent messages
    borderTopRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: '#E5E5EA', // Gray for received messages
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#FFFFFF', // White text in sent messages
  },
  otherUserText: {
    color: '#000000', // Black text in received messages
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#FFF',
    paddingHorizontal: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    height: 40,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#FFD700', // Yellow text for send button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
