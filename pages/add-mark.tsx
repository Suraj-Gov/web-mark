import { useContext, useState } from "react";
import Tags from "../components/Tags";
import UserContext from "../contexts/UserContext";

export default function add_mark() {
  const { userContext } = useContext(UserContext);

  return (
    <>
      {userContext.uid === "" ? (
        <h1>You need to be logged in</h1>
      ) : (
        <div>
          <Tags />
        </div>
      )}
    </>
  );
}
