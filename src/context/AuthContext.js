import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const DEFAULT_USER = {
  id: "user-101",
  firstName: "Alex",
  lastName: "Smith",
  name: "Alex Smith",
  phone: "+91 98765 43210",
  countryCode: "+91",
  email: "alex.smith@restamp.in",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  verified: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const loginWithPhoneAndName = ({ phone, countryCode, firstName, lastName }) => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || "User";
    const updated = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullName,
      phone: `${countryCode} ${phone}`,
      countryCode,
      verified: true,
    };
    setUser(updated);
    setIsAuthenticated(true);
    return updated;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginWithPhoneAndName,
        logout,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
