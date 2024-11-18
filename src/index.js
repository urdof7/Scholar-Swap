// // import React from "react"
// // import ReactDOM from "react-dom/client"
// // import "./index.css"
// // import AppMain from "./AppMain"
// // import { GoogleOAuthProvider } from "@react-oauth/google"
// // import { BrowserRouter as Router } from "react-router-dom";


// // const root = ReactDOM.createRoot(document.getElementById("root"))
// // root.render(
// //   //Wrap OAuthProvider so it is available across app
// //   //Replace with your client Id
// //   <GoogleOAuthProvider clientId="101931362137-hm7advb6q9ndkvh9re5d7nj9317h5sm8.apps.googleusercontent.com">
// //     {/* <React.StrictMode> */}
// //     <Router>
// //       <AppMain />
// //     </Router>
// //     {/* </React.StrictMode> */}
// //   </GoogleOAuthProvider>
// // )

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { AppRegistry } from "react-native"; // Required for React Native compatibility
// import App from "./componentsUpdated/app";
// import "./index.css"; // Your global CSS for the web
// import appConfig from "./app.json"; // Add app.json with app name

// // Register the app for React Native compatibility
// AppRegistry.registerComponent(appName, () => App);

// // Render the app for web
// const rootElement = document.getElementById("root");
// const root = ReactDOM.createRoot(rootElement);
// const appName = appConfig.expo.name;

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you're using React Native Web, call AppRegistry to handle root element
// AppRegistry.runApplication(appName, {
//   initialProps: {},
//   rootTag: rootElement,
// });

import React from "react";
import { AppRegistry } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import App from "./componentsUpdated/app"; // Ensure this path is correct
import appConfig from "./app.json"; // Ensure the app.json file is in the correct location



const appName = appConfig.expo.name;

const RootComponent = () => {
  // <GoogleOAuthProvider clientId="101931362137-hm7advb6q9ndkvh9re5d7nj9317h5sm8.apps.googleusercontent.com"><
      return <App />;
  // </GoogleOAuthProvider>
};

AppRegistry.registerComponent(appName, () => RootComponent);

// This ensures compatibility with React Native Web
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
