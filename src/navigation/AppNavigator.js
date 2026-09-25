import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Search, Heart, MessageSquare, User } from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SavedScreen from "../screens/SavedScreen";
import EnquiriesScreen from "../screens/EnquiriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MenuScreen from "../screens/MenuScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
  Profile: {
    label: "Profile",
    Icon: User,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = tabConfig[route.name] || tabConfig.Home;
        const IconComponent = config.Icon;

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#111111",
          tabBarInactiveTintColor: "#8E8E93",

          tabBarLabel: config.label,

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 2,
            marginBottom: Platform.OS === "ios" ? 0 : 2,
          },

          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 6,
          },

          tabBarStyle: {
            position: "absolute",
            bottom: Platform.OS === "ios" ? 24 : 16,
            left: 16,
            right: 16,
            height: 64,
            backgroundColor: "#FFFFFF",
            borderRadius: 32,
            borderTopWidth: 0,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 10,
            paddingBottom: Platform.OS === "ios" ? 8 : 6,
            paddingTop: 6,
            borderWidth: Platform.OS === "web" ? 1 : 0,
            borderColor: "#F0F0F0",
          },

          tabBarIcon: ({ color, focused }) => {
            const fill = route.name === "Saved" && focused ? color : "none";

            return (
              <IconComponent
                size={20}
                color={color}
                fill={fill}
                strokeWidth={focused ? 2.3 : 1.8}
              />
            );
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate("Search", {
              openFilterModal: Date.now(),
            });
          },
        })}
      />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Enquiries" component={EnquiriesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}