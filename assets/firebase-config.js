// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-SctOeyzWl7bloe6eyAj9Pqsz_bFtjnQ",
    authDomain: "rayyan-app-4d233.firebaseapp.com",
    projectId: "rayyan-app-4d233",
    storageBucket: "rayyan-app-4d233.firebasestorage.app",
    messagingSenderId: "546696801619",
    appId: "1:546696801619:web:4efb7470e2ed03739645a6",
    measurementId: "G-D9GEN4EBFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
