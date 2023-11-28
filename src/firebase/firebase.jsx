// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth, onAuthStateChanged  } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCBbByyoz6TythzJ7w335gkDEayux0aS6Q",
    authDomain: "datagraph.firebaseapp.com",
    projectId: "datagraph",
    storageBucket: "datagraph.appspot.com",
    messagingSenderId: "854266914654",
    appId: "1:854266914654:web:d073409a36fb86f30d51cf"
  };

const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);
// Initialize Firebase Authentication and get a reference to the auth service
const auth = getAuth(app);

export { db, auth, onAuthStateChanged };