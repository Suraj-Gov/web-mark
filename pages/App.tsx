import { useContext } from "react";
import AddMark from "../components/AddMark";
import Login from "../components/Login";
import Logout from "../components/Logout";
import UserContext from "../contexts/UserContext";

export default function App() {
  const { userContext } = useContext(UserContext);
  return (
    <div>
      <h1>Web Mark</h1>
      <Login />
      {userContext.uid && <AddMark />}
      <Logout />
    </div>
  );
}
