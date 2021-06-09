import firebase from "firebase/app";
import "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBhJTiziDpu3OOq4Zh7pFWUNBImJQTZTrw",
  authDomain: "whatsapp-web-7618c.firebaseapp.com",
  projectId: "whatsapp-web-7618c",
  storageBucket: "whatsapp-web-7618c.appspot.com",
  messagingSenderId: "285287152157",
  appId: "1:285287152157:web:952bf2110d76d9c09524f4"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
// const db = firebaseApp.firestore(); 
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};
// export default db;
