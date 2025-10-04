
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQhysePnY5yzsYuLU5at9aEbKt6tH_sN4",
  authDomain: "pharmafind-ai-rhiea.firebaseapp.com",
  projectId: "pharmafind-ai-rhiea",
  storageBucket: "pharmafind-ai-rhiea.appspot.com",
  messagingSenderId: "42342835647",
  appId: "1:42342835647:web:efd61ed7c0fc191b8dad0a"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
