// 🔥 Firebase Setup
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey:"AIzaSyBRYbyNPE-HKi9iIOcYBuISCaznI58Wblk",
  authDomain: 
"virtualclassroom-45b9d.firebse.com",
  projectId: 
"virtualclassroom-45b9d",
  storageBucket: 
"virtualclassroom-45b9d.appspot.com",
  messagingSenderId: "239091176675",
  appId: "1:239091176675:web:5e941d195ed3e71d18e1d6",
  databaseURL: "https://virtualclassroom-45b9d-default-rtdb.firebaseio.com/",
};

// Firebase App Initialize
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
