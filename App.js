import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { WishlistProvider } from "./src/context/WishlistContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <WishlistProvider>
        <AppNavigator />
      </WishlistProvider>
    </SafeAreaProvider>
  );
}