
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import the getAuth function from Firebase
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNm_VLysWSwCVdjC7BKOw76e-CyqYpIuA",
    authDomain: "test-44a8d.firebaseapp.com",
    projectId: "test-44a8d",
    storageBucket: "test-44a8d.firebasestorage.app",
    messagingSenderId: "1025063401474",
    appId: "1:1025063401474:web:7cedf98f64a64bf2f88f1b",
    measurementId: "G-YM1259PQK8"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore, then export them
const auth = getAuth(app);  // This initializes the auth service
const db = getFirestore(app);  // This initializes Firestore

export { db, collection, addDoc, getDocs };

