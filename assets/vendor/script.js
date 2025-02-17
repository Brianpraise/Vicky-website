

  // Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD3GHv0CTjD3MulDiO-RR-Wdqy8_NOsdA",
  authDomain: "vickychepkorirportfolio.firebaseapp.com",
  projectId: "vickychepkorirportfolio",
  storageBucket: "vickychepkorirportfolio.appspot.com", // Fixed storageBucket
  messagingSenderId: "832198336772",
  appId: "1:832198336772:web:083fcf0555d499a64ab051"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database, ref, set, get, child };
