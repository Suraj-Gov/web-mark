import "../styles/globals.css";
import UserContext, { defaultUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import Router from "next/router";
import firebase from "../constants/firebase";
import "firebase/auth";
import checkLoggedInUser from "../functions/checkLoggedInUser";

NProgress.configure({
  minimum: 0.3,
  easing: "cubic-bezier(0.7, 0, 0.84, 0)",
  speed: 800,
  showSpinner: true,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const [userContext, setUserContext] = useState(defaultUser);

  useEffect(() => {
    checkLoggedInUser(setUserContext);
  }, []);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
