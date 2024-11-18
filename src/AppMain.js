import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import FrontPage from "./componentsUpdated/frontpage.jsx";
import Home from "./componentsUpdated/home.jsx";
import Search from "./componentsUpdated/search.jsx";
// These are the old components from two weeks ago, the new components are componentsUpdated. It just needs to be switched to that for navigation
//However, this navigation is in react web routing while the new components are in react native. I keep running into this error. 


function AppMain() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setIsLoggedIn(true);
          console.log("Profile set: ", data);
          navigate("/home");  // Navigate to /home after setting profile and login state
        })
        .catch((err) => console.log(err));
    }
  }, [user, navigate]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="AppMain">
      <nav className="header">
        <h2>Scholar Swap</h2>
      </nav>
      <Routes>
        {/* <Route path="/" element={<FrontPage onLogin={login} />} />
        <Route path="/home" element={<Home profile={profile} logOut={logOut} isLoggedIn={isLoggedIn} />} />
        <Route path="/search" element={<Search isLoggedIn={isLoggedIn} />} /> */}

  <Route path="/" element={<div>FrontPage Placeholder</div>} />
  <Route path="/home" element={<div>Home Placeholder</div>} />
  <Route path="/search" element={<div>Search Placeholder</div>} />


      </Routes>
    </div>
  );
}

export default AppMain;
