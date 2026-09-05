import React from "react";

import {
  View,
  StyleSheet,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  Ionicons,
} from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import WishlistScreen from "../screens/WishlistScreen";
import ExploreScreen from "../screens/ExploreScreen";
import MessageScreen from "../screens/MessageScreen";
import AccountScreen from "../screens/AccountScreen";

import COLORS from "../constants/colors";

const Tab = createBottomTabNavigator();


// =====================================================
// TAB ICON SETTINGS
// =====================================================

const tabIcons = {
  Home: {
    active: "home",
    inactive: "home-outline",

    width: 32,
    height: 32,
    size: 24,
  },

  Wishlist: {
    active: "heart",
    inactive: "heart-outline",

    width: 32,
    height: 32,
    size: 24,
  },

  Explore: {
    active: "compass",
    inactive: "compass-outline",

    width: 32,
    height: 32,
    size: 24,
  },

  Messages: {
    active: "chatbubble",
    inactive: "chatbubble-outline",

    width: 32,
    height: 32,
    size: 24,
  },

  Account: {
    active: "person",
    inactive: "person-outline",

    width: 32,
    height: 32,
    size: 24,
  },
};


// =====================================================
// NAVIGATOR
// =====================================================

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const iconConfig =
            tabIcons[route.name];

          return {
            headerShown: false,

            // =========================================
            // TAB COLORS
            // =========================================

            tabBarActiveTintColor:
              COLORS.primary,

            tabBarInactiveTintColor:
              "#A4A4A4",

            // =========================================
            // TAB BAR STYLE
            // =========================================

            tabBarStyle: {
              height: 72,

              paddingTop: 8,
              paddingBottom: 10,

              borderTopWidth: 1,
              borderTopColor: "#EEEEEE",

              backgroundColor:
                COLORS.white,
            },

            // =========================================
            // LABEL
            // =========================================

            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "500",
            },

            // =========================================
            // ICON
            // =========================================

            tabBarIcon: ({
              color,
              focused,
            }) => {
              const iconName = focused
                ? iconConfig.active
                : iconConfig.inactive;

              return (
                <View
                  style={[
                    styles.iconContainer,
                    {
                      width:
                        iconConfig.width,

                      height:
                        iconConfig.height,
                    },
                  ]}
                >
                  <Ionicons
                    name={iconName}
                    size={iconConfig.size}
                    color={color}
                  />
                </View>
              );
            },
          };
        }}
      >
        {/* HOME */}

        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        {/* WISHLIST */}

        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
        />

        {/* EXPLORE */}

        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
        />

        {/* MESSAGES */}

        <Tab.Screen
          name="Messages"
          component={MessageScreen}
        />

        {/* ACCOUNT */}

        <Tab.Screen
          name="Account"
          component={AccountScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});