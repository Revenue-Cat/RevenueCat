import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4QeoRQyEYmTBOZ__zdnQ_wX5DG2Xd6Io",
  authDomain: "quitqly-e5383.firebaseapp.com",
  projectId: "quitqly-e5383",
  storageBucket: "quitqly-e5383.firebasestorage.app",
  messagingSenderId: "1079110225769",
  appId: "1:1079110225769:web:46fbf27dc18cbac62e37f8",
  measurementId: "G-BM62XWJ7XQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };