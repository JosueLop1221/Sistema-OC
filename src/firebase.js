import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;

