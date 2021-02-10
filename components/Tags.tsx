// https://css-tricks.com/auto-growing-inputs-textareas/

import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ContainerSpan = styled.span`
  position: relative;
  padding: 0.5rem 1rem;
  display: inline-block;
  margin: 1rem;
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
  const [tagString, setTagString] = useState("");
  const [tags, setTags] = useState([""]);

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    if (e.target.value.slice(-1) === " ") {
      setTags((prev) => (prev.length < 5 ? prev.concat([""]) : prev));
    }
    setTags((prev) => prev.map((p, ip) => (ip === idx ? e.target.value : p)));
    // setTags((prev) => prev.filter((i) => i.length !== 0));
  };

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
