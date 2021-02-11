import { ReactNode } from "react";
import styled from "styled-components";
import Link from "next/link";

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

type Props = {
  children: ReactNode;
};
export default function Header({ children }: Props) {
  return (
    <div>
      <TopHeader>
        <Link href="/">
          <a>
            <h1 style={{ display: "inline-block" }}>Web Mark</h1>
          </a>
        </Link>
        {children}
      </TopHeader>
    </div>
  );
}
