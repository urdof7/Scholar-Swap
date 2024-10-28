import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your components
import FrontPage from './components/frontpage';  // New front page component
import Home from './components/home';
import Login from './components/login';
import SignUp from './components/signup';
import Search from './components/search';
import Product from './components/product';
import Profile from './components/profile';
import Notifications from './components/notifications';
import Transaction from './components/transactions';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081'],  // Replace with your correct URL in production
  config: {
    screens: {
      FrontPage: '',
      Home: 'home',
      Login: 'login',
      SignUp: 'signup',
      Search: 'search',
      Product: 'product/:id',
      Profile: 'profile',
      Notifications: 'notifications',
      Transaction: 'transaction/:id',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="FrontPage">
        {/* Front Page Screen */}
        <Stack.Screen name="FrontPage" component={FrontPage} options={{ title: 'Welcome' }} />

        {/* Other Screens */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Transaction" component={Transaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
