import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LayoutGrid,
  Building2,
  PlusCircle,
  Users,
  User,
} from "lucide-react-native";

import OwnerDashboardScreen from "../screens/owner/OwnerDashboardScreen";
import OwnerPropertiesScreen from "../screens/owner/OwnerPropertiesScreen";
import OwnerAddPropertyScreen from "../screens/owner/OwnerAddPropertyScreen";
import OwnerLeadsScreen from "../screens/owner/OwnerLeadsScreen";
import OwnerProfileScreen from "../screens/owner/OwnerProfileScreen";

const Tab = createBottomTabNavigator();

function OwnerTabBar({ state, descriptors, navigation }) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View style={styles.pillContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || route.name}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? "#111111" : "#8E8E93",
                size: 24,
              })}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function OwnerNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBar={(props) => <OwnerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. Dashboard */}
      <Tab.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{
          tabBarAccessibilityLabel: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid
              size={24}
              color={color}
              strokeWidth={focused ? 2.4 : 1.8}
            />
          ),
        }}
      />

      {/* 2. Properties */}
      <Tab.Screen
        name="Properties"
        component={OwnerPropertiesScreen}
        options={{
          tabBarAccessibilityLabel: "Properties",
          tabBarIcon: ({ color, focused }) => (
            <Building2
              size={24}
              color={color}
              strokeWidth={focused ? 2.4 : 1.8}
            />
          ),
        }}
      />

      {/* 3. Add */}
      <Tab.Screen
        name="Add"
        component={OwnerAddPropertyScreen}
        options={{
          tabBarAccessibilityLabel: "Add Property",
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle
              size={26}
              color={color}
              strokeWidth={focused ? 2.4 : 1.8}
            />
          ),
        }}
      />

      {/* 4. Leads */}
      <Tab.Screen
        name="Leads"
        component={OwnerLeadsScreen}
        options={{
          tabBarAccessibilityLabel: "Leads",
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={24}
              color={color}
              strokeWidth={focused ? 2.4 : 1.8}
            />
          ),
        }}
      />

      {/* 5. Profile */}
      <Tab.Screen
        name="Profile"
        component={OwnerProfileScreen}
        options={{
          tabBarAccessibilityLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User
              size={24}
              color={color}
              strokeWidth={focused ? 2.4 : 1.8}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pillContainer: {
    flexDirection: "row",
    height: 64,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
});
