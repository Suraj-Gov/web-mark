import firebase from "../constants/firebase";
import "firebase/auth";

export default function Logout() {
  const signOut = async () => {
    await firebase.auth().signOut();
  };

  return <button onClick={signOut}>Log out</button>;
}
