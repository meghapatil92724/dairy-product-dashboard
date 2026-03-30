import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app, auth, db;
export const isMock = firebaseConfig.apiKey === "YOUR_API_KEY";

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase not initialized. Please add your config to src/services/firebase.js", error);
}

// Utility for anonymous login
export const loginAnonymously = async () => {
  if (!auth) return null;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
};

// Utility to save chat history
export const saveChatMessage = async (userId, message, response, sentiment) => {
  if (!db || isMock) return;
  try {
    await addDoc(collection(db, "chats"), {
      userId,
      message,
      response,
      sentiment,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving chat:", error);
  }
};

// Utility to save mood
export const saveMood = async (userId, moodValue, label, source = 'manual') => {
  if (!db || isMock) return;
  try {
    await addDoc(collection(db, "moods"), {
      userId,
      moodValue,
      label,
      source, // 'manual', 'facial', 'chat'
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving mood:", error);
  }
};

// Utility to save facial expression
export const saveFacialExpression = async (userId, expression, scores) => {
  if (!db || isMock) return;
  try {
    await addDoc(collection(db, "expressions"), {
      userId,
      expression,
      scores,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving expression:", error);
  }
};

// Utility to get recent moods
export const getRecentMoods = async (userId, days = 7) => {
  if (!db || isMock) return [];
  try {
    const q = query(
      collection(db, "moods"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(days)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching moods:", error);
    return [];
  }
};

export { auth, db, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
