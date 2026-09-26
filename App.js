import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { WishlistProvider } from "./src/context/WishlistContext";
import { OwnerProvider } from "./src/context/OwnerContext";
import AnimatedSplashScreen from "./src/components/AnimatedSplashScreen";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <WishlistProvider>
        <OwnerProvider>
          <AppNavigator />
          {isSplashVisible && (
            <AnimatedSplashScreen
              onAnimationComplete={() => setIsSplashVisible(false)}
            />
          )}
        </OwnerProvider>
      </WishlistProvider>
    </SafeAreaProvider>
  );
}