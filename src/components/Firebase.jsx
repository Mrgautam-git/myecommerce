import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLFsqOpwNctT2qyBG0Ko_bzyPsLOGwWDQ",
  authDomain: "myecom-58051.firebaseapp.com",
  projectId: "myecom-58051",
  storageBucket: "myecom-58051.firebasestorage.app",
  messagingSenderId: "770521739837",
  appId: "1:770521739837:web:e29da84d47f9ee488bf054"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

// Export app as default and auth as a named export
export { auth };
export default app;
