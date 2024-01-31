import { GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_fD7f4xSwHrrSs1TeZf_tY4GYULNSIsA",
  authDomain: "sandar-inmuebles.firebaseapp.com",
  projectId: "sandar-inmuebles",
  storageBucket: "sandar-inmuebles.appspot.com",
  messagingSenderId: "1048623026714",
  appId: "1:1048623026714:web:8b981112e772fa5a78b7a3",
  measurementId: "G-ZRT9VJ085L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {
  app,
  auth,
  firestore,
  storage,
  analytics,
  googleAuthProvider,
  addDoc,
  collection as db, // Renombrado a 'db' para su exportación
};
