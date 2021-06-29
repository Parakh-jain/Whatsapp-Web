import firebase from "firebase/app";
import "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
};

const firebaseApp =firebase.initializeApp(firebaseConfig); 
const auth = firebase.auth();  //Authentication
const provider = new firebase.auth.GoogleAuthProvider();  // for sign in with google

export {auth,provider};
