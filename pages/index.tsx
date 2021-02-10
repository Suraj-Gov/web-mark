import Head from "next/head";
import App from "./App";

import UserContext, { defaultUser } from "../contexts/UserContext";
import { useState } from "react";

export default function Home() {
  const [userContext, setUserContext] = useState(defaultUser);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <Head>
        <title>Web Mark</title>
      </Head>
      <App />
    </UserContext.Provider>
  );
}
