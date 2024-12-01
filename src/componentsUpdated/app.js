import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from './AuthContext';
import { GoogleOAuthProvider } from "@react-oauth/google"

// Import your screens
import Home from "./screens/home";
import Search from "./screens/search";
import Profile from "./screens/profile";
import Product from "./screens/product";
import Signup from "./screens/signup";
import Transaction from "./screens/transactions";
import Notifications from "./screens/notifications";
import Login from "./screens/login";
import FrontPage from "./screens/frontpage";
import UploadProductPage from "./screens/UploadProductPage";
import Chat from "./screens/chat.js"

const Stack = createStackNavigator();

export default function App() {
  return (
    <GoogleOAuthProvider clientId="101931362137-hm7advb6q9ndkvh9re5d7nj9317h5sm8.apps.googleusercontent.com">
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="FrontPage" component={FrontPage} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Product" component={Product} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Transaction" component={Transaction} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="UploadProduct" component={UploadProductPage} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
