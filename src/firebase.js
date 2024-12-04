// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // Import Firebase Auth
// import { getStorage } from "firebase/storage"; // Import Firebase Storage

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAVDtCVEhTbpzWkip7xRmiMrclg27lT5so",
//   authDomain: "scholar-swap-439312.firebaseapp.com",
//   projectId: "scholar-swap-439312",
//   storageBucket: "scholar-swap-439312.firebasestorage.app", // Update to match the bucket
//   messagingSenderId: "101931362137",
//   appId: "1:101931362137:web:6ce3f3a29f465fc9858e48",
//   measurementId: "G-KJ53HFVD5T",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app); // Initialize Firestore
// const auth = getAuth(app); // Initialize Auth
// const storage = getStorage(app); // Initialize Storage

// // Export Firestore, Auth, and Storage
// export { db, auth, storage };


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbedHOBfmzS4opRuGDtKF9BmSVzQZLHpI",
  authDomain: "scholar-swap-demo.firebaseapp.com",
  projectId: "scholar-swap-demo",
  storageBucket: "scholar-swap-demo.firebasestorage.app",
  messagingSenderId: "863926647713",
  appId: "1:863926647713:web:d5b767ef311c667d4069e0",
  measurementId: "G-V0MM3QFHM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);