import { useContext } from "react";
import UserContext from "../contexts/UserContext";

export default function add_mark() {
  const { userContext } = useContext(UserContext);

  return (
    <>
      {userContext.uid === "" ? (
        <h1>You need to be logged in</h1>
      ) : (
        <h1>You're logged in</h1>
      )}
    </>
  );
}
