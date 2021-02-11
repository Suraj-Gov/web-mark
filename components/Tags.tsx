// https://css-tricks.com/auto-growing-inputs-textareas/

import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TagsContext from "../contexts/TagsContext";

const ContainerSpan = styled.span`
  position: relative;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin: 0.5rem;
  margin-left: 0;
  margin-right: 1rem;
  min-height: 1.3rem;
  min-width: 8rem;
`;

const WidthSpan = styled.span`
  font-size: 1.3rem;
`;

const Input = styled.input`
  text-align: center;
  outline: none;
  border: none;
  background: #d7d7d7;
  border-radius: 10px;
  font-size: 1.3rem;
  position: absolute;
  min-width: 8rem;
  padding: 0.5rem 1rem;
  width: 100%;
  left: 0;
`;

const TagContainer = styled.div`
  @media only screen and (max-width: 800px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

type TagProp = {
  text: string;
  handleChange: any;
  focused: boolean;
  handleKeyDown: any;
};

const Tag = ({ handleKeyDown, focused, text, handleChange }: TagProp) => {
  const tagRef = useRef();

  useEffect(() => {
    // this is showing that tagRef could be null
    // @ts-ignore
    // focus when focused is true
    focused && tagRef.current.focus();
  }, [focused]);

  return (
    <ContainerSpan className="input-wrap">
      <WidthSpan className="width-machine" aria-hidden={true}>
        {text}
      </WidthSpan>
      <Input
        type="text"
        onKeyDown={(e) => handleKeyDown(e)}
        value={text}
        placeholder="Add Tag"
        onChange={(e) => handleChange(e)}
        ref={tagRef}
      />
    </ContainerSpan>
  );
};

const Tags = () => {
  const { setTagsContext } = useContext(TagsContext);
  const MAX_TAGS = 5;
  const [tags, setTags] = useState([""]);

  useEffect(() => {
    setTagsContext(tags);
  }, [tags]);

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    // if the spacebar is pressed
    if (e.target.value.slice(-1) === " ") {
      // if the tag is the last tag OR if the tag is empty and the user simply presses the spacebar
      if (
        (tags.length === idx + 1 && e.target.value.length === 1) ||
        tags.length === MAX_TAGS
      ) {
        // do nothing
        return;
      }
      // else, add a new tag
      setTags((prev) => (prev.length < MAX_TAGS ? prev.concat([""]) : prev));
      return;
    }
    // if spacebar is not pressed, some other button is pressed (ascii only)
    setTags((prev) =>
      prev.map((p, ip) =>
        ip === idx
          ? // filter out space in the word
            e.target.value
              .split("")
              .filter((i) => i !== " ")
              .join("")
              .slice(0, 16)
          : p
      )
    );
  };

  const handleKeyDown = (e: KeyboardEvent, idx: number) => {
    if (e.code === "Backspace" || e.code === "Delete") {
      // if it is not the first tag and the tag length is 0
      if (idx !== 0 && tags[idx].length === 0) {
        // remove the tag
        setTags((prev) => {
          return prev.filter((p, pidx) => {
            // if the tag is empty and it's the idx where the event was invoked, return false
            // which basically means don't include that tag ^
            return !(p === "" && pidx === idx);
          });
        });
      }
    }
  };

  return (
    <TagContainer>
      {tags.map((i, idx, arr) => (
        <Tag
          // this just sees if the tag being rendered is the last one or not, if it's the last one, focus it
          focused={arr.length === idx + 1 ? true : false}
          key={idx}
          text={i}
          // this is for handling the events on input html
          handleChange={(e) => handleTagChange(e, idx)}
          // this is for handling the backspace key event
          handleKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ))}
    </TagContainer>
  );
};

export default Tags;
