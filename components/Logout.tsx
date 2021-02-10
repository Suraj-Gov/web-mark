import firebase from "../constants/firebase";
import "firebase/auth";
import { useContext } from "react";
import UserContext, { defaultUser } from "../contexts/UserContext";

export default function Logout() {
  const { setUserContext } = useContext(UserContext);
  const signOut = async () => {
    setUserContext(defaultUser);
    await firebase.auth().signOut();
  };

  return <button onClick={signOut}>Log out</button>;
}
