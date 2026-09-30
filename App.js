import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { WishlistProvider } from "./src/context/WishlistContext";
import { OwnerProvider } from "./src/context/OwnerContext";
import { AgentProvider } from "./src/context/AgentContext";
import AnimatedSplashScreen from "./src/components/AnimatedSplashScreen";

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <WishlistProvider>
        <OwnerProvider>
          <AgentProvider>
            <AppNavigator />
            {isSplashVisible && (
              <AnimatedSplashScreen
                onAnimationComplete={() => setIsSplashVisible(false)}
              />
            )}
          </AgentProvider>
        </OwnerProvider>
      </WishlistProvider>
    </SafeAreaProvider>
  );
}