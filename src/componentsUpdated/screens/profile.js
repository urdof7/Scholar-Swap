// Import necessary modules
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
import {
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null); // Firebase Auth user
  const [profileData, setProfileData] = useState(null); // Firestore user data
  const [isEditingProfile, setIsEditingProfile] = useState(false); // Toggle edit mode
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Toggle password change mode
  const [firstName, setFirstName] = useState(''); // For first name
  const [lastName, setLastName] = useState(''); // For last name
  const [academicYear, setAcademicYear] = useState(''); // For academic year
  const [email, setEmail] = useState(''); // For email
  const [currentPassword, setCurrentPassword] = useState(''); // For current password
  const [newPassword, setNewPassword] = useState(''); // For new password
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // For confirm new password
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
          setAcademicYear(data.academicYear || 'Freshman');
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
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Please enter a valid email address.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already in use by another account.');
      } else {
        setErrorMessage('An error occurred while updating your profile.');
      }
    }
  };

  const handleChangePassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      setSuccessMessage('Password updated successfully.');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect current password.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Your new password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/requires-recent-login') {
        setErrorMessage('Please reauthenticate to update your password.');
      } else {
        setErrorMessage('An error occurred while updating your password.');
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
        <Text style={styles.logoText}>MyApp</Text> {/* Replace with your app's name */}
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
              uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
            }}
          />
          {!isEditingProfile && !isChangingPassword && (
            <>
              <Text style={styles.profileName}>
                {`${firstName} ${lastName}`}
              </Text>
              <Text style={styles.universityInfo}>Wake Forest University</Text>
              <Text style={styles.classInfo}>
                {academicYear ? academicYear : 'Freshman'}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setIsEditingProfile(true);
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={() => {
                  setIsChangingPassword(true);
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
            </>
          )}

          {isEditingProfile && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>First Name:</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Last Name:</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Academic Year:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={academicYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => setAcademicYear(itemValue)}
                    dropdownIconColor="#FFF"
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Academic Year" value="" color="#999" />
                    <Picker.Item label="Freshman" value="Freshman" color="#FFF" />
                    <Picker.Item label="Sophomore" value="Sophomore" color="#FFF" />
                    <Picker.Item label="Junior" value="Junior" color="#FFF" />
                    <Picker.Item label="Senior" value="Senior" color="#FFF" />
                  </Picker>
                </View>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email:</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Email"
                  placeholderTextColor="#999"
                />
              </View>
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
          )}

          {isChangingPassword && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Current Password:</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>New Password:</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Confirm New Password:</Text>
                <TextInput
                  style={styles.input}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                />
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
              <View style={styles.profileButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setIsChangingPassword(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
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
                  source={{
                    uri: 'https://www.example.com/product-image.png', // Replace with a valid product image URL
                  }}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>Product Name</Text>
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
  logoText: {
    fontSize: 24,
    color: '#FFD700', // Gold color
    fontWeight: 'bold',
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
    width: 120, // Increased size
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24, // Increased font size
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
  fieldContainer: {
    width: '100%',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    color: '#FFF',
    backgroundColor: '#333',
  },
  pickerContainer: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  picker: {
    height: 50,
    color: '#FFF',
    backgroundColor: '#333', // Dark background for picker
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '15%',
  },
  saveButton: {
    backgroundColor: '#28a745', // Green
    paddingVertical: 10,
    paddingHorizontal: 10, // Reduced padding to give more space
    borderRadius: 5,
    marginRight: 10,
    flex: 1, 
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red
    paddingVertical: 10,
    paddingHorizontal: 10, // Reduced padding to give more space
    borderRadius: 5,
    flex: 1, 
  },  
  editButton: {
    backgroundColor: '#007bff', // Blue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  changePasswordButton: {
    backgroundColor: '#6c757d', // Grey
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
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
