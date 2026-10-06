import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  ShieldCheck,
  MapPin,
  Building2,
  MessageSquare,
  Calendar,
  Crown,
  Sparkles,
  RotateCw,
  CreditCard,
  FileText,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useAgent } from "../../context/AgentContext";
import AppBrandHeader from "../../components/AppBrandHeader";

export default function AgentProfileScreen({ navigation }) {
  const {
    agentPlan,
    selectedLocalities,
    agentProfile,
    leads,
    visits,
    renewPlan,
  } = useAgent();

  const [pushEnabled, setPushEnabled] = useState(true);

  const activePlanName = agentPlan?.name || "Agent Pro Plan";
  const propertiesCount = 12;
  const leadsCount = leads?.length || 6;
  const visitsCount = visits?.length || 2;

  const handleSwitchToBuyer = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to sign out of your Agent Studio? Your active subscription and leads remain saved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP BRAND HEADER (Matching Buyer Page) */}
      <AppBrandHeader currentRole="agent" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card Banner */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                agentProfile?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{agentProfile?.name || "Jessica Taylor"}</Text>
            <Text style={styles.userEmail}>
              {agentProfile?.email || "jessica.taylor@example.com"}
            </Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={13} color="#16A34A" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedBadgeText}>Verified Agent & Partner</Text>
            </View>
          </View>
        </View>

        {/* Top Mode Switch / Buyer Portal Banner */}
        <TouchableOpacity
          style={styles.modeSwitchBanner}
          activeOpacity={0.88}
          onPress={handleSwitchToBuyer}
        >
          <View style={styles.modeSwitchContent}>
            <View style={styles.modeSwitchIconWrap}>
              <Building2 size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.modeSwitchTitle}>Buyer Portal</Text>
              <Text style={styles.modeSwitchSub} numberOfLines={1}>
                Browse verified properties & owner listings as a Buyer
              </Text>
            </View>
            <View style={styles.modeSwitchPill}>
              <Text style={styles.modeSwitchPillText}>Open Portal</Text>
              <ArrowRight size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* SECTION 1 — ACCOUNT */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.cardContainer}>
            {/* 1. Personal Information */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert(
                  "Personal Information",
                  `Name: ${agentProfile?.name || "Jessica Taylor"}\nEmail: ${
                    agentProfile?.email || "jessica.taylor@example.com"
                  }\nPhone: ${agentProfile?.phone || "+91 98401 23456"}\nAgency: ${
                    agentProfile?.agency || "Prime Realty Partners"
                  }\nRERA: ${agentProfile?.reraNumber || "TN/AGENT/2024/0918"}`
                )
              }
            >
              <View style={styles.rowLeft}>
                <User size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Personal Information</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 2. KYC / Verification */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert(
                  "KYC / Verification",
                  "RERA Certificate & Aadhaar authentication completed and verified."
                )
              }
            >
              <View style={styles.rowLeft}>
                <ShieldCheck size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>KYC / Verification</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.statusVerified}>Verified</Text>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. Saved Address */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert(
                  "Saved Address",
                  "Office: 42, 2nd Avenue, Anna Nagar East, Chennai - 600102"
                )
              }
            >
              <View style={styles.rowLeft}>
                <MapPin size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Saved Address</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2 — MY ACTIVITY */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>MY ACTIVITY</Text>
          <View style={styles.cardContainer}>
            {/* 1. Saved Properties / Managed Properties */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => navigation.navigate("AgentProperties")}
            >
              <View style={styles.rowLeft}>
                <Building2 size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Saved Properties</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{propertiesCount}</Text>
                </View>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 2. Enquiries / Leads */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => navigation.navigate("AgentLeads")}
            >
              <View style={styles.rowLeft}>
                <MessageSquare size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Enquiries</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{leadsCount}</Text>
                </View>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. Site Visits */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => navigation.navigate("AgentVisits")}
            >
              <View style={styles.rowLeft}>
                <Calendar size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Site Visits</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{visitsCount}</Text>
                </View>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 3 — SUBSCRIPTION */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>SUBSCRIPTION</Text>
          <View style={styles.cardContainer}>
            {/* 1. Current Plan */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => navigation.navigate("AgentLocationSelect")}
            >
              <View style={styles.rowLeft}>
                <Crown size={20} color="#2563EB" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Current Plan</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.statusPlan}>{activePlanName}</Text>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 2. Upgrade Plan */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => navigation.navigate("AgentLocationSelect")}
            >
              <View style={styles.rowLeft}>
                <Sparkles size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Upgrade Plan</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. Renew Plan */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => {
                renewPlan();
                Alert.alert("Plan Renewed", "Your agent subscription has been renewed for 30 days.");
              }}
            >
              <View style={styles.rowLeft}>
                <RotateCw size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Renew Plan</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 4. Payment History */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert(
                  "Payment History",
                  `Last Transaction: ${agentPlan?.price || "₹6,999"} on 28 Sep 2026 (${activePlanName}) - Completed.`
                )
              }
            >
              <View style={styles.rowLeft}>
                <CreditCard size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Payment History</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 4 — SETTINGS & PREFERENCES */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>SETTINGS & PREFERENCES</Text>
          <View style={styles.cardContainer}>
            {/* Notification */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => Alert.alert("Notifications", "Push notifications are enabled.")}
            >
              <View style={styles.rowLeft}>
                <Bell size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Notification</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Help Center */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert(
                  "RESTAMP Support",
                  "Agent Partner Desk: agent-support@restamp.in or call 1800-RESTAMP-AGENT."
                )
              }
            >
              <View style={styles.rowLeft}>
                <HelpCircle size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Help Center</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={handleLogout}
            >
              <View style={styles.rowLeft}>
                <LogOut size={20} color="#EF4444" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={[styles.rowLabel, { color: "#EF4444" }]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  modeSwitchBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
  },
  modeSwitchContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeSwitchIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modeSwitchTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primary,
  },
  modeSwitchSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  modeSwitchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  modeSwitchPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionGroup: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    overflow: "hidden",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusVerified: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
  },
  statusPlan: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  countBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginLeft: 48,
    marginRight: 16,
  },
});
