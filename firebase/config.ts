// Import the functions you need from the SDKs you need
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa4ipKThYht91nc70ccB-rvyQsIyXIt28",
  authDomain: "livewell-app.firebaseapp.com",
  projectId: "livewell-app",
  storageBucket: "livewell-app.appspot.com",
  messagingSenderId: "599118811190",
  appId: "1:599118811190:web:b6bf04d02990921e3ec897",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
