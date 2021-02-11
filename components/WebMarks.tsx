import firebase from "../constants/firebase";
import "firebase/database";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";
const db = firebase.firestore();

const StateIndicator = styled.h3`
  margin: 2rem;
  text-align: center;
  font-size: 1.5rem;
`;

const WebMarks: React.FC = () => {
  const { userContext } = useContext(UserContext);
  const [webMarks, setWebMarks] = useState(null);

  useEffect(() => {
    userContext.uid !== "" &&
      (async () => {
        const webMarks = await db
          .collection("webmarks")
          .where("userId", "==", userContext.uid)
          .get();
        if (webMarks.empty) {
          setWebMarks([]);
        } else setWebMarks(webMarks.docs.map((i) => i.data()));
      })();
  }, [userContext.uid]);

  return userContext.uid === "" ? (
    <StateIndicator>Login to mark websites</StateIndicator>
  ) : webMarks === null ? (
    <StateIndicator>Loading</StateIndicator>
  ) : (
    <pre>{JSON.stringify(webMarks, null, 2)}</pre>
  );
};

export default WebMarks;
