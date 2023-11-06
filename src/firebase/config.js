import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3DcKanKJ3iLlc083qS2w7MY-i8nnYryU",
  authDomain: "sistema-de-reviews.firebaseapp.com",
  projectId: "sistema-de-reviews",
  storageBucket: "sistema-de-reviews.appspot.com",
  messagingSenderId: "322075133702",
  appId: "1:322075133702:web:bcba3606babdc944928087",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
