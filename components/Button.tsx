import { MouseEvent, ReactNode } from "react";
import styled from "styled-components";

const CustomButton = styled.button`
  background: #2e2e2e;
  border: none;
  outline: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  color: white;
  font-size: 1.4rem;
`;

type Props = {
  onClickHandler?: (e: MouseEvent) => void;
  buttonText?: string;
  children?: ReactNode;
};

const Button = ({ onClickHandler, buttonText, children }: Props) => {
  return children ? (
    <CustomButton>{children}</CustomButton>
  ) : (
    <CustomButton onClick={onClickHandler}>{buttonText}</CustomButton>
  );
};

export default Button;
