import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfBl_KMBi6Tj8W65X_52z7I_NIjB3rQiU",
  authDomain: "hiring-7788a.firebaseapp.com",
  projectId: "hiring-7788a",
  storageBucket: "hiring-7788a.appspot.com",
  messagingSenderId: "485270752035",
  appId: "1:485270752035:web:e27ff63f1e7c6432085a96"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 