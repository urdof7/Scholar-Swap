import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null); // Store user data, including email

  const signIn = (userData) => {
    setIsSignedIn(true);
    setUser(userData); // Store user details
  };

  const signOut = () => {
    setIsSignedIn(false);
    setUser(null); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
