import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  User,
} from "lucide-react-native";

import AgentDashboardScreen from "../screens/agent/AgentDashboardScreen";
import AgentPropertiesScreen from "../screens/agent/AgentPropertiesScreen";
import AgentLeadsScreen from "../screens/agent/AgentLeadsScreen";
import AgentVisitsScreen from "../screens/agent/AgentVisitsScreen";
import AgentProfileScreen from "../screens/agent/AgentProfileScreen";

const Tab = createBottomTabNavigator();

const agentTabConfig = {
  Dashboard: {
    label: "Dashboard",
    Icon: LayoutDashboard,
  },
  Properties: {
    label: "Properties",
    Icon: Building2,
  },
  Leads: {
    label: "Leads",
    Icon: Users,
  },
  Visits: {
    label: "Visits",
    Icon: CalendarDays,
  },
  Profile: {
    label: "Profile",
    Icon: User,
  },
};

export default function AgentNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => {
        const config = agentTabConfig[route.name] || agentTabConfig.Dashboard;
        const IconComponent = config.Icon;

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#94A3B8",

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

          tabBarIcon: ({ color, focused }) => (
            <IconComponent
              size={20}
              color={color}
              strokeWidth={focused ? 2.3 : 1.8}
            />
          ),
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={AgentDashboardScreen} />
      <Tab.Screen name="Properties" component={AgentPropertiesScreen} />
      <Tab.Screen name="Leads" component={AgentLeadsScreen} />
      <Tab.Screen name="Visits" component={AgentVisitsScreen} />
      <Tab.Screen name="Profile" component={AgentProfileScreen} />
    </Tab.Navigator>
  );
}
