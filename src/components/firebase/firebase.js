import { GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';  // Solo importa getAuth una vez
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyRTZNRCwagZOh7byzwSfTzDSBoCpndFo",
  authDomain: "sandarinmuebles.firebaseapp.com",
  projectId: "sandarinmuebles",
  storageBucket: "sandarinmuebles.appspot.com",
  messagingSenderId: "898443516583",
  appId: "1:898443516583:web:0138a248020172d9051982",
  measurementId: "G-R8VCMHDJ3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export {app, auth, firestore, analytics, googleAuthProvider };
