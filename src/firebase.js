import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ1dm7agsBphnAcb2NtdhtTgAQbX_SmgU",
  authDomain: "ingwebairbnb.firebaseapp.com",
  projectId: "ingwebairbnb",
  storageBucket: "ingwebairbnb.appspot.com",
  messagingSenderId: "51032773956",
  appId: "1:51032773956:web:07b253473707c8c689b311"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    const navigation = useNavigate();
    try {
        const res = signInWithPopup(auth, googleProvider);
        const user = res.user;
        navigation("/Home")
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
  };
  