import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDsRWvGte-APSJxPe70Hn-jltVhUw1XICc",
  authDomain: "nstw-display.firebaseapp.com",
  databaseURL:
    "https://nstw-display-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "nstw-display",
  storageBucket: "nstw-display.appspot.com",
  messagingSenderId: "256147941009",
  appId: "1:256147941009:web:1144079a168c786a8bc130",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
