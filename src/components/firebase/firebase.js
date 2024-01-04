import { GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';  // Solo importa getAuth una vez
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_fD7f4xSwHrrSs1TeZf_tY4GYULNSIsA",
  authDomain: "sandar-inmuebles.firebaseapp.com",
  projectId: "sandar-inmuebles",
  storageBucket: "sandar-inmuebles.appspot.com",
  messagingSenderId: "1048623026714",
  appId: "1:1048623026714:web:8b981112e772fa5a78b7a3",
  measurementId: "G-ZRT9VJ085L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, firestore, analytics, googleAuthProvider };
