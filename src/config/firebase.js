
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHdcsvn-HGr2BAPWKCxLZSedIKK-3VdWs",
  authDomain: "metting-fcbcf.firebaseapp.com",
  projectId: "metting-fcbcf",
  storageBucket: "metting-fcbcf.firebasestorage.app",
  messagingSenderId: "872922744229",
  appId: "1:872922744229:web:2c149e701ac46d415e944c",
  measurementId: "G-W8H5DSWSBW",
};

// Init only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);