import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import AppMain from "./AppMain"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter as Router } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  //Wrap OAuthProvider so it is available across app
  //Replace with your client Id
  <GoogleOAuthProvider clientId="101931362137-hm7advb6q9ndkvh9re5d7nj9317h5sm8.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
    <Router>
      <AppMain />
    </Router>
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
)


