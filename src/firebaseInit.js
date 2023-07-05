// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbg6nET5UX5luoRsJaFB3qksmIgU7-X38",
  authDomain: "contact-list-4c407.firebaseapp.com",
  projectId: "contact-list-4c407",
  storageBucket: "contact-list-4c407.appspot.com",
  messagingSenderId: "96650722162",
  appId: "1:96650722162:web:6cd5b23d0ffe91a2993beb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);