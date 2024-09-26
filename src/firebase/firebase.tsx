import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "crud-digitalzone.firebaseapp.com",
    projectId: "crud-digitalzone",
    storageBucket: "crud-digitalzone.appspot.com",
    messagingSenderId: "131531012735",
    appId: "1:131531012735:web:07c61c24883c48aa639d4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)