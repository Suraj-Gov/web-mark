import firebase from "../constants/firebase";
import "firebase/auth";
import "firebase/firestore";
import UserContext, { defaultUser } from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";

const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

export default function Login() {
  const { userContext, setUserContext } = useContext(UserContext);

  const findOrCreateUser = async (user) => {
    const users = db.collection("users");
    const findUser = await users.where("uid", "==", user.uid).get();
    console.log(findUser.docs[0].data(), "found user");
    if (findUser.docs.length === 0) {
      const newUser = await users.add({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    }
    setUserContext({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        findOrCreateUser(user);
      } else {
        setUserContext(defaultUser);
      }
    });
  }, []);

  const signIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch((error) => {
        alert(error.message);
      });
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => alert(error.message));
  };

  return (
    <div>
      {!userContext.uid ? (
        <button onClick={signIn}>Sign in with Google</button>
      ) : (
        <button onClick={signOut}>Sign out</button>
      )}
      <div>{JSON.stringify(userContext)}</div>
    </div>
  );
}
