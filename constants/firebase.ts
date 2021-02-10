import firebase from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBttJXQRl0eFsgGaqG2ZDq5sbYU2LmYXjs",
  authDomain: "web-mark-304119.firebaseapp.com",
  projectId: "web-mark-304119",
  storageBucket: "web-mark-304119.appspot.com",
  messagingSenderId: "673633829676",
  appId: "1:673633829676:web:7a4d79651d9bbd7f8ee289",
  measurementId: "G-89HW7B50S3",
};

firebase.apps.length === 0 && firebase.initializeApp(firebaseConfig);
const fire = firebase;
export default fire;
