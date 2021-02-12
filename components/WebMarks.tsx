import firebase from "../constants/firebase";
import "firebase/database";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";
import Image from "next/image";
import Router from "next/router";
const db = firebase.firestore();

const StateIndicator = styled.h3`
  margin: 2rem;
  text-align: center;
  font-size: 1.5rem;
`;

// prettier-ignore
const DeleteSvg = ({fillColor}) => <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0H37C39.7614 0 42 2.23858 42 5V42H15C6.71573 42 0 35.2843 0 27V0Z" fill={fillColor}/>
<rect x="11" y="27.9697" width="23.9988" height="4.28549" rx="2" transform="rotate(-45 11 27.9697)" fill="black"/>
<rect x="14.0303" y="11" width="23.9988" height="4.28549" rx="2" transform="rotate(45 14.0303 11)" fill="black"/>
</svg>

const WebMarksContainer = styled.div`
  padding: 3rem;
  padding-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  @media only screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & img {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
`;

interface WebMarkContainerProps {
  bgColor: object;
}

const getColor = (bgColor) => {
  const rgbArr = bgColor.rgb;
  return `rgb(${rgbArr[0]},${rgbArr[1]},${rgbArr[2]})`;
};

const WebMarkContainer = styled.div<WebMarkContainerProps>`
  position: relative;
  border-radius: 10px;
  background-color: ${(props) => getColor(props.bgColor)};
  @media only screen and (max-width: 800px) {
    overflow-wrap: break-word;
    width: 90vw;
  }
  & .delete-svg {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
  }
`;

const WebMarkTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.8rem;
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
          .orderBy("timestamp", "desc")
          .get();
        if (webMarks.empty) {
          setWebMarks([]);
        } else setWebMarks(webMarks.docs.map((i) => i));
      })();
  }, [userContext.uid]);

  const deleteMark = async (id: string) => {
    try {
      await db.collection("webmarks").doc(id).delete();
      setWebMarks((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return userContext.uid === "" ? (
    <StateIndicator>Login to mark websites</StateIndicator>
  ) : webMarks === null ? (
    <StateIndicator>Loading</StateIndicator>
  ) : webMarks.length === 0 ? (
    <StateIndicator>Add a new mark!</StateIndicator>
  ) : (
    <WebMarksContainer>
      {webMarks.reverse().map((i, idx) => (
        <WebMarkContainer bgColor={i.data().color} key={idx}>
          <a href={i.data().url}>
            <Image
              src={i.data().imageUrl}
              alt={i.data().pageTitle}
              width={400}
              height={230}
              layout="responsive"
            />
          </a>
          <button onClick={() => deleteMark(i.id)} className="delete-svg">
            <DeleteSvg fillColor={getColor(i.data().color)} />
          </button>
          <a href={i.data().url}>
            <WebMarkTitle>{i.data().pageTitle}</WebMarkTitle>
          </a>
        </WebMarkContainer>
      ))}
    </WebMarksContainer>
  );
};

export default WebMarks;
