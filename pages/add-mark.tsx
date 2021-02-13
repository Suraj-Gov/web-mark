import {
  BaseSyntheticEvent,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import Tags from "../components/Tags";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";
import Header from "../components/Header";
import Button from "../components/Button";
import TagsContext from "../contexts/TagsContext";
import firebase from "../constants/firebase";
import "firebase/firestore";
import axios from "axios";
import router from "next/router";

const db = firebase.firestore();

const Input = styled.input`
  font-size: 1.5rem;
  padding: 0.8rem;
  width: 40vw;
  border-radius: 5px;
  background: #d7d7d7;
  border: none;
  outline: none;
  @media only screen and (max-width: 800px) {
    width: 90vw;
  }
`;

const InputContainer = styled.div`
  padding: 2rem;
  @media only screen and (max-width: 800px) {
    padding: 0;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default function add_mark() {
  const { userContext } = useContext(UserContext);
  const { tagsContext } = useContext(TagsContext);
  const [url, setUrl] = useState("");

  const addMark = async (e) => {
    let properUrl = url;
    if (url.slice(0, 7) !== "http://" && url.slice(0, 8) !== "https://") {
      properUrl = "http://" + url;
      setUrl(properUrl);
    }
    e.target.disabled = true;
    e.target.innerText = "Adding";
    // checking for existing webmark
    const existingMark = await db
      .collection("webmarks")
      .where("url", "==", properUrl)
      .get();
    if (existingMark.empty) {
      try {
        const { data } = await axios.post(
          "https://web-mark.netlify.app/.netlify/functions/generateScreenshot",
          {
            pageUrl: properUrl,
            userId: userContext.uid,
          }
        );
        const newMark = {
          userId: userContext.uid,
          url: data.url,
          tags: tagsContext.filter((t) => t.length > 0),
          pageTitle: data.pageTitle,
          imageUrl: data.imageURL,
          color: data.color,
          timestamp: data.timestamp,
        };
        try {
          const addedMark = await db.collection("webmarks").add(newMark);
          router.replace("/");
        } catch (err) {
          alert(err.message);
        }
      } catch (err) {
        console.log(err);
        alert("Something went wrong");
      }
    } else {
      alert("Mark already exists");
    }
    e.target.innerText = "Add";
    e.target.disabled = false;
  };

  return (
    <>
      {userContext.uid === "" ? (
        <h1>You need to be logged in</h1>
      ) : (
        <>
          <Header>
            <Button buttonText="Add" onClickHandler={(e) => addMark(e)} />
          </Header>
          <InputContainer>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="Enter website URL"
            />
            <div>
              <Tags />
            </div>
          </InputContainer>
        </>
      )}
    </>
  );
}
