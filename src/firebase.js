// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSRSkp7Z8CVszE9MmA4TSozK1dcD8JtO4",
  authDomain: "scholar-swap-439312.firebaseapp.com",
  projectId: "scholar-swap-439312",
  storageBucket: "scholar-swap-439312.firebasestorage.app", // Update to match the bucket
  messagingSenderId: "101931362137",
  appId: "1:101931362137:web:6ce3f3a29f465fc9858e48",
  measurementId: "G-KJ53HFVD5T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth
const storage = getStorage(app); // Initialize Storage

// Export Firestore, Auth, and Storage
export { db, auth, storage };
