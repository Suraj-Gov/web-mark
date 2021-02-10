// https://css-tricks.com/auto-growing-inputs-textareas/

import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// prettier-ignore
export const RemoveTagSVG = () => <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="20" cy="20" r="20" fill="#CF3B3B"/>
<rect x="7.09216" y="12.891" width="6.875" height="28.75" rx="3.4375" transform="rotate(-45 7.09216 12.891)" fill="#D7D7D7"/>
<rect x="27.4215" y="8.02966" width="6.875" height="28.75" rx="3.4375" transform="rotate(45 27.4215 8.02966)" fill="#D7D7D7"/>
</svg>

const ContainerSpan = styled.span`
  position: relative;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin: 1rem;
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
  border-radius: 50px;
  font-size: 1.3rem;
  position: absolute;
  min-width: 8rem;
  padding: 0.5rem 1rem;
  width: 100%;
  left: 0;
`;

type Props = {
  text: string;
  handleChange: any;
  focused: boolean;
};

const Tag = ({ focused, text, handleChange }: Props) => {
  const tagRef = useRef();

  useEffect(() => {
    // this is showing that tagRef could be null
    // @ts-ignore
    focused && tagRef.current.focus();
  }, []);

  return (
    <ContainerSpan className="input-wrap">
      <WidthSpan className="width-machine" aria-hidden={true}>
        {text}
      </WidthSpan>
      <Input
        type="text"
        value={text}
        placeholder="Add Tag"
        onChange={(e) => handleChange(e)}
        ref={tagRef}
      />
    </ContainerSpan>
  );
};

const Tags = () => {
  const MAX_TAGS = 5;
  const [tags, setTags] = useState([""]);

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    if (e.target.value.slice(-1) === " ") {
      if (
        (tags.length === idx + 1 && e.target.value.length === 1) ||
        tags.length === MAX_TAGS
      ) {
        return;
      }
      setTags((prev) => (prev.length < MAX_TAGS ? prev.concat([""]) : prev));
    }
    setTags((prev) => prev.map((p, ip) => (ip === idx ? e.target.value : p)));
  };

  const handleBackspace = (e: KeyboardEvent) => {
    if (e.code === "Backspace") {
      console.log(tags);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => handleBackspace(e));
    return () => window.removeEventListener("keydown", handleBackspace);
  }, []);

  return (
    <>
      {tags.map((i, idx, arr) => (
        <Tag
          focused={arr.length === idx + 1 ? true : false}
          key={idx}
          text={i}
          handleChange={(e) => handleTagChange(e, idx)}
        />
      ))}
    </>
  );
};

export default Tags;
