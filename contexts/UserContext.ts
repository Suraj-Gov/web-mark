import { createContext } from "react";
import { Dispatch, SetStateAction } from "react";

type UserContextType = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
};

type userContextState = {
  userContext: UserContextType;
  setUserContext: Dispatch<SetStateAction<UserContextType>>;
};

export const defaultUser: UserContextType = {
  displayName: "",
  email: "",
  photoURL: "",
  uid: "",
};

const UserContext = createContext<userContextState>(null);

export default UserContext;
