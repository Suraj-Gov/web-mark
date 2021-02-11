import { useContext } from "react";
import AddMark from "../components/AddMark";
import Header from "../components/Header";
import Login from "../components/Login";
import Logout from "../components/Logout";
import WebMarks from "../components/WebMarks";
import UserContext from "../contexts/UserContext";

export default function App() {
  const { userContext } = useContext(UserContext);
  return (
    <>
      <Header>
        <>
          <Login />
          {userContext.uid !== "" && <AddMark />}
        </>
      </Header>
      <WebMarks />

      {/* <Logout /> */}
    </>
  );
}
