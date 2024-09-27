import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "digitall-zone-9acb7.firebaseapp.com",
    projectId: "digitall-zone-9acb7",
    storageBucket: "digitall-zone-9acb7.appspot.com",
    messagingSenderId: "352601009575",
    appId: "1:352601009575:web:223cfb09de3eac8a72da82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)



