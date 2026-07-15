import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeD_QIG5SBMqS40MAGcirJf7tmMRzFTWE",
  authDomain: "idea-tank-india-d4b22.firebaseapp.com",
  databaseURL: "https://idea-tank-india-d4b22-default-rtdb.firebaseio.com",
  projectId: "idea-tank-india-d4b22",
  storageBucket: "idea-tank-india-d4b22.firebasestorage.app",
  messagingSenderId: "100169450374",
  appId: "1:100169450374:web:b2b6a8f39118288655a207",
  measurementId: "G-815V8HVKKR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };