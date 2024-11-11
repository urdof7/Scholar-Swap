import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your components
import home from "./screens/home"; // Ensure the path is correct
import search from "./screens/search"; // Ensure this component exists
import profile from "./screens/profile";
import product from "./screens/product";
import signup from "./screens/signup";
import transaction from "./screens/transactions";
import notifications from "./screens/notifications";
import login from "./screens/login";
import frontpage from "./app";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="frontpage">
        <Stack.Screen name="frontpage" component={frontpage}/>
        <Stack.Screen name="profile" component={profile} />
        <Stack.Screen name="product" component={product} />
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="search" component={search} />
        <Stack.Screen name="signup" component={signup} />
        <Stack.Screen name="transaction" component={transaction} />
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="notifications" component={notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
