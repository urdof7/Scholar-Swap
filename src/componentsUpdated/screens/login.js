import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";


const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  client_id: "863926647713-hq4splkoh97hkatr46ind0pnmf63k6km.apps.googleusercontent.com", // Use your OAuth Client ID
});


const DEFAULT_PROFILE_PICTURE = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

// Helper function to split full name into first and last names
const splitName = (fullName) => {
  if (!fullName) return { firstName: "", lastName: "" };
  
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts.shift();
  const lastName = nameParts.join(" ");
  
  return { firstName, lastName };
};

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useContext(AuthContext); // Auth context
  const [googleUser, setGoogleUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error messages

  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Google OAuth Success:", response);
      setGoogleUser(response);
    },
    onError: (error) => console.error("Google OAuth Error:", error),
  });

  // Handle Firebase Email/Password Login
  const handleLogin = async () => {
    setErrorMessage(""); // Clear any previous error messages
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    try {
      console.log("Attempting email/password login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User logged in with email:", user.email);

      // Firestore user document reference
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.log("Firestore document does not exist for email/password user. This should have been created during signup.");
        // Optionally, navigate to a profile setup screen or notify the user
      } else {
        console.log("Firestore document already exists for:", user.email);
      }

      signIn(); // Update global sign-in state
      console.log("Navigating to FrontPage screen...");
      navigation.navigate("FrontPage");
    } catch (error) {
      console.error("Email login failed:", error);
      console.log("Error code:", error.code);

      // Handle errors and display appropriate messages
      let message;

      switch (error.code) {
        case 'auth/user-not-found':
          message = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          message = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-email':
          message = "Please enter a valid email address.";
          break;
        case 'auth/too-many-requests':
          message = "Too many failed login attempts. Please try again later.";
          break;
        default:
          message = "An error occurred during sign-in. Please try again.";
      }

      // Set the error message to state to display it in the UI
      setErrorMessage(message);
    }
  };

  // Handle Google Login and Firestore Integration
  useEffect(() => {
    const authenticateWithFirebase = async (googleAccessToken) => {
      setErrorMessage(""); // Clear any previous error messages
      try {
        // Create a credential with the Google access token
        const credential = GoogleAuthProvider.credential(null, googleAccessToken);

        // Sign in with Firebase using the credential
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        console.log("User signed in with Google:", user);

        // Firestore user document reference
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.log("Creating Firestore document for Google user...");
          
          // Split displayName into firstName and lastName
          const displayName = user.displayName || "";
          const { firstName, lastName } = splitName(displayName);

          await setDoc(userDocRef, {
            email: user.email,
            firstName: firstName,
            lastName: lastName,
            profilePicture: user.photoURL || DEFAULT_PROFILE_PICTURE, // Use Google profile picture or default
            academicYear: null, // Set to null
            createdAt: new Date(),
          });
          console.log("Firestore document created successfully for Google user!");
        } else {
          console.log("Firestore document already exists for Google user:", user.email);
        }

        signIn(); // Update global sign-in state
        console.log("Navigating to FrontPage screen after Google login...");
        navigation.navigate("FrontPage");
      } catch (error) {
        console.error("Error during Firebase Google Sign-In:", error);
        console.log("Error code:", error.code);

        // Handle errors and display appropriate messages
        let message;

        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            message = "An account already exists with the same email but different sign-in credentials.";
            break;
          case 'auth/invalid-credential':
            message = "The credential is invalid or expired. Please try again.";
            break;
          case 'auth/user-disabled':
            message = "This account has been disabled.";
            break;
          case 'auth/popup-closed-by-user':
            message = "The popup has been closed before completing sign-in.";
            break;
          default:
            message = "An error occurred during Google sign-in. Please try again.";
        }

        setErrorMessage(message);
      }
    };

    if (googleUser) {
      console.log("Fetching Google User Info...");
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
        headers: {
          Authorization: `Bearer ${googleUser.access_token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          console.log("Fetched Google User Data:", data);

          // Authenticate with Firebase using the Google access token
          await authenticateWithFirebase(googleUser.access_token);
        })
        .catch((err) => {
          console.error("Error fetching Google user info:", err);
          setErrorMessage("Failed to fetch Google user info. Please try again.");
        });
    }
  }, [googleUser, navigation, signIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Scholar Swap</Text>

      {/* Display error message */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Email Login */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login with Email" onPress={handleLogin} />

      {/* Google Login */}
      <TouchableOpacity style={styles.googleButton} onPress={googleLogin}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <Text
        style={styles.linkText}
        onPress={() => navigation.navigate("Signup")} // Navigate to Signup for new users
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Black background for contrast
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: "#FFD700", // Gold color for title
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#333", // Dark gray input background
    borderRadius: 10,
    paddingHorizontal: 10,
    color: "#FFD700", // Gold text color
    marginBottom: 15,
    fontSize: 16, // Adjust font size for better readability
  },
  googleButton: {
    marginTop: 20,
    backgroundColor: "#4285F4", // Google blue
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#FFD700",
    marginTop: 10,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
