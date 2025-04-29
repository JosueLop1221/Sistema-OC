import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyC5vuvTfN8Ql_Js19rgnDjazA3177KvcDA",
  authDomain: "castillo-it-da835.firebaseapp.com",
  projectId: "castillo-it-da835",
  storageBucket: "castillo-it-da835.firebasestorage.app",
  messagingSenderId: "11441382403",
  appId: "1:11441382403:web:45827822c82976fc1d9a36",
  measurementId: "G-MCBB0LMR8R"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;

