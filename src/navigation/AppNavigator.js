import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Search, Heart, MessageSquare, User } from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SavedScreen from "../screens/SavedScreen";
import EnquiriesScreen from "../screens/EnquiriesScreen";
import MenuScreen from "../screens/MenuScreen";

const Tab = createBottomTabNavigator();

const tabConfig = {
  Home: {
    label: "Home",
    Icon: Home,
  },
  Search: {
    label: "Search",
    Icon: Search,
  },
  Saved: {
    label: "Saved",
    Icon: Heart,
  },
  Enquiries: {
    label: "Enquiries",
    Icon: MessageSquare,
  },
  Menu: {
    label: "Menu",
    Icon: User,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const config = tabConfig[route.name] || tabConfig.Home;
          const IconComponent = config.Icon;

          return {
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,

            tabBarItemStyle: {
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 0,
              marginHorizontal: 0,
            },

            tabBarIconStyle: {
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            },

            tabBarStyle: {
              position: "absolute",
              bottom: Platform.OS === "ios" ? 24 : 16,
              left: 12,
              right: 12,
              height: 64,
              backgroundColor: "#FFFFFF",
              borderRadius: 32,
              borderTopWidth: 0,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 10,
              paddingHorizontal: 2,
              paddingBottom: 0,
              paddingTop: 0,
              alignItems: "center",
              justifyContent: "center",
            },

            tabBarIcon: ({ focused }) => {
              const activeColor = "#111111";
              const inactiveColor = "#8E8E93";
              const color = focused ? activeColor : inactiveColor;
              const fill = route.name === "Saved" && focused ? "#111111" : "none";

              return (
                <View style={styles.tabItemContainer}>
                  <IconComponent
                    size={20}
                    color={color}
                    fill={fill}
                    strokeWidth={focused ? 2.2 : 1.8}
                  />
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    allowFontScaling={false}
                    style={[
                      styles.tabLabel,
                      { color },
                      focused && styles.tabLabelActive,
                    ]}
                  >
                    {config.label}
                  </Text>
                </View>
              );
            },
          };
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Saved" component={SavedScreen} />
        <Tab.Screen name="Enquiries" component={EnquiriesScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
    lineHeight: 12,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    fontWeight: "600",
  },
});