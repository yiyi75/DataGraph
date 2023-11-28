// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged  } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "datagraph",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx"
  };

const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);
// Initialize Firebase Authentication and get a reference to the auth service
const auth = getAuth(app);

export { db, auth, onAuthStateChanged };