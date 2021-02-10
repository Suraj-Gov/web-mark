import { Dispatch, SetStateAction } from "react";
import { UserContextType } from "../contexts/UserContext";
import firebase from "../constants/firebase";
import "firebase/auth";

export default function checkLoggedInUser(
  setUserContext: Dispatch<SetStateAction<UserContextType>>
) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUserContext({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    }
  });
}
