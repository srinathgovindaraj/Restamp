import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
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

  // Hide the tab bar when on Add property screen or when explicitly requested
  const currentRoute = state.routes[state.index];
  const currentOptions = descriptors[currentRoute?.key]?.options;
  if (currentRoute?.name === "Add" || currentOptions?.tabBarStyle?.display === "none") {
    return null;
  }

  const bottomInset = Math.max(insets.bottom, Platform.OS === "ios" ? 14 : 8);

  return (
    <View style={[styles.bottomBarContainer, { paddingBottom: bottomInset }]}>
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const activeColor = "#2563EB";
          const inactiveColor = "#64748B";
          const color = isFocused ? activeColor : inactiveColor;

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
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color,
                  size: 22,
                })}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color,
                    fontWeight: isFocused ? "700" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
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
          tabBarLabel: "Dashboard",
          tabBarAccessibilityLabel: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid
              size={22}
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
          tabBarLabel: "Properties",
          tabBarAccessibilityLabel: "Properties",
          tabBarIcon: ({ color, focused }) => (
            <Building2
              size={22}
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
          tabBarStyle: { display: "none" },
          tabBarLabel: "Add",
          tabBarAccessibilityLabel: "Add Property",
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle
              size={24}
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
          tabBarLabel: "Leads",
          tabBarAccessibilityLabel: "Leads",
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={22}
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
          tabBarLabel: "Profile",
          tabBarAccessibilityLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User
              size={22}
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
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  tabsRow: {
    flexDirection: "row",
    height: 54,
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 6,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: 0.1,
  },
});
