import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SavedScreen from "../screens/SavedScreen";
import EnquiriesScreen from "../screens/EnquiriesScreen";
import MenuScreen from "../screens/MenuScreen";

import COLORS from "../constants/colors";
import TYPOGRAPHY from "../constants/typography";

const Tab = createBottomTabNavigator();

const tabConfig = {
  Home: {
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  Search: {
    label: "Search",
    activeIcon: "search",
    inactiveIcon: "search-outline",
  },
  Saved: {
    label: "Saved",
    activeIcon: "heart",
    inactiveIcon: "heart-outline",
  },
  Enquiries: {
    label: "Enquiries",
    activeIcon: "chatbubble-ellipses",
    inactiveIcon: "chatbubble-ellipses-outline",
  },
  Menu: {
    label: "Menu",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const config = tabConfig[route.name] || tabConfig.Home;

          return {
            headerShown: false,
            tabBarShowLabel: false,

            tabBarStyle: {
              position: "absolute",
              bottom: Platform.OS === "ios" ? 28 : 20,
              left: 16,
              right: 16,
              height: 68,
              backgroundColor: "#FFFFFF",
              borderRadius: 40,
              borderTopWidth: 0,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 10,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            },

            tabBarIcon: ({ focused }) => {
              const iconName = focused ? config.activeIcon : config.inactiveIcon;
              const activeColor = "#111111";
              const inactiveColor = "#8E8E93";

              return (
                <View style={styles.tabItemContainer}>
                  <Ionicons
                    name={iconName}
                    size={23}
                    color={focused ? activeColor : inactiveColor}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: focused ? activeColor : inactiveColor },
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
    paddingVertical: 4,
  },
  tabLabel: {
    ...TYPOGRAPHY.bottomTab,
    marginTop: 3,
  },
  tabLabelActive: {
    fontWeight: "600",
  },
});