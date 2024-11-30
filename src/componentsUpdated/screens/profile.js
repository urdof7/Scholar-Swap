import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../../firebase'; // Adjust the import path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, updateEmail } from 'firebase/auth';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null); // Firebase Auth user
  const [profileData, setProfileData] = useState(null); // Firestore user data
  const [isEditingProfile, setIsEditingProfile] = useState(false); // Toggle edit mode
  const [firstName, setFirstName] = useState(''); // For first name
  const [lastName, setLastName] = useState(''); // For last name
  const [academicYear, setAcademicYear] = useState(''); // For academic year
  const [email, setEmail] = useState(''); // For email
  const [errorMessage, setErrorMessage] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success messages

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email); // Set current email in state
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData(data);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setAcademicYear(data.academicYear || '');
        } else {
          console.log('No user data found in Firestore.');
        }
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleSaveProfile = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!firstName || !lastName || !academicYear || !email) {
      setErrorMessage('Please fill out all profile fields.');
      return;
    }

    try {
      // Update email in Firebase Authentication if it has changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update profile data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firstName,
        lastName,
        academicYear,
        email,
      });

      setSuccessMessage('Profile updated successfully.');
      setIsEditingProfile(false);
      // Refresh user data
      setUser({ ...user, email });
      setProfileData({
        ...profileData,
        firstName,
        lastName,
        academicYear,
        email,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'auth/requires-recent-login') {
        setErrorMessage('Please reauthenticate to update your email.');
        // You might want to prompt the user to sign in again
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already in use by another account.');
      } else {
        setErrorMessage('An error occurred while updating your profile.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
      setErrorMessage('An error occurred while signing out.');
    }
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
            source={{
              uri: user?.photoURL || 'https://your-default-image-url.com',
            }}
          />
          {isEditingProfile ? (
            <>
              <TextInput
                style={styles.nameInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.nameInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#999"
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={academicYear}
                  style={styles.picker}
                  onValueChange={(itemValue) => setAcademicYear(itemValue)}
                >
                  <Picker.Item label="Select Academic Year" value="" />
                  <Picker.Item label="Freshman" value="Freshman" />
                  <Picker.Item label="Sophomore" value="Sophomore" />
                  <Picker.Item label="Junior" value="Junior" />
                  <Picker.Item label="Senior" value="Senior" />
                </Picker>
              </View>
              <TextInput
                style={styles.emailInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor="#999"
              />
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
              <View style={styles.profileButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsEditingProfile(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.profileName}>
                {firstName || lastName ? `${firstName} ${lastName}` : 'Your Name'}
              </Text>
              <Text style={styles.universityInfo}>
                {profileData?.university || 'Wake Forest University'}
              </Text>
              <Text style={styles.classInfo}>
                {academicYear ? `${academicYear}` : 'Academic Year'}
              </Text>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingProfile(true)}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
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
          {Array(5)
            .fill()
            .map((_, index) => (
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

        {/* Sign-Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
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
  nameInput: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#FFF',
    width: '80%',
  },
  emailInput: {
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: '#FFF',
    width: '80%',
  },
  pickerContainer: {
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: '80%',
  },
  picker: {
    height: 50,
    color: '#FFF',
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#28a745', // Green
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#007bff', // Blue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
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
  signOutButton: {
    backgroundColor: '#dc3545', // Red
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
});
