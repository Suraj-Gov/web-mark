import "../styles/globals.css";
import UserContext, { defaultUser } from "../contexts/UserContext";
import TagsContext from "../contexts/TagsContext";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import Router from "next/router";
import "firebase/auth";
import checkLoggedInUser from "../helperFunctions/checkLoggedInUser";

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
  const [tagsContext, setTagsContext] = useState([""]);

  useEffect(() => {
    checkLoggedInUser(setUserContext);
  }, []);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <TagsContext.Provider value={{ tagsContext, setTagsContext }}>
        <Component {...pageProps} />
      </TagsContext.Provider>
    </UserContext.Provider>
  );
}

export default MyApp;
