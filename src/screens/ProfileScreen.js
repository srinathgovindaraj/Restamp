import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
  Platform,
} from "react-native";
import {
  User,
  ShieldCheck,
  MapPin,
  Building2,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  Crown,
  Sparkles,
  RotateCw,
  CreditCard,
  FileText,
  Bell,
  Globe,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from "lucide-react-native";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useWishlist } from "../context/WishlistContext";
import { useOwner } from "../context/OwnerContext";

export default function ProfileScreen({ navigation }) {
  const nav = useNavigation() || navigation;
  const { wishlist } = useWishlist();
  const { subscription, properties, leads } = useOwner();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const activePlanName = subscription?.planName || "Gold Assist";
  const propertiesCount = properties?.length || 8;
  const leadsCount = leads?.length || 6;
  const wishlistCount = wishlist?.length || 5;

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to sign out of RESTAMP?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () =>
            Alert.alert("Signed Out", "You have been logged out successfully."),
        },
      ]
    );
  };

  const handleOpenOwnerPortal = () => {
    nav.navigate(subscription?.active ? "OwnerNavigator" : "OwnerPlans");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Screen Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card Banner */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Jessica Taylor</Text>
            <Text style={styles.userEmail}>jessica.taylor@example.com</Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={13} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedBadgeText}>Verified Buyer & Owner</Text>
            </View>
          </View>
        </View>

        {/* Top Mode Switch / Post Property Banner (Matching Screenshot Top Card) */}
        <TouchableOpacity
          style={styles.modeSwitchBanner}
          activeOpacity={0.88}
          onPress={handleOpenOwnerPortal}
        >
          <View style={styles.modeSwitchContent}>
            <View style={styles.modeSwitchIconWrap}>
              <Building2 size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.modeSwitchTitle}>Property Owner Portal</Text>
              <Text style={styles.modeSwitchSub} numberOfLines={1}>
                {subscription?.active
                  ? "Manage your active listings & buyer leads"
                  : "Browse flats, villas & commercial properties as a Buyer"}
              </Text>
            </View>
            <View style={styles.modeSwitchPill}>
              <Text style={styles.modeSwitchPillText}>
                {subscription?.active ? "Open Portal" : "Switch Mode"}
              </Text>
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
                  "Name: Jessica Taylor\nEmail: jessica.taylor@example.com\nPhone: +91 98765 43210"
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
                  "KYC Verification",
                  "Aadhaar & PAN verification completed and verified."
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
                  "Default: A3/4 Jawhra, Prime Enclave, OMR, Chennai"
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
            {/* 1. Saved Properties */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => nav.navigate("Saved")}
            >
              <View style={styles.rowLeft}>
                <Building2 size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Saved Properties</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{wishlistCount || 8}</Text>
                </View>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 2. Enquiries */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => nav.navigate("Enquiries")}
            >
              <View style={styles.rowLeft}>
                <MessageSquare size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Enquiries</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{leadsCount || 6}</Text>
                </View>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. Site Visits */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert("Site Visits", "You have 2 scheduled property site visits.")
              }
            >
              <View style={styles.rowLeft}>
                <Calendar size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Site Visits</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>2</Text>
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
              onPress={() => nav.navigate("OwnerPlans")}
            >
              <View style={styles.rowLeft}>
                <Crown size={20} color="#EA580C" strokeWidth={1.8} style={styles.rowIcon} />
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
              onPress={() => nav.navigate("OwnerPlans")}
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
              onPress={() => nav.navigate("OwnerPlans")}
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
                  "Last Transaction: ₹1,999 on 26 Sep 2026 (Gold Assist Plan) - Completed."
                )
              }
            >
              <View style={styles.rowLeft}>
                <CreditCard size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Payment History</Text>
              </View>
              <ChevronRight size={17} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 5. Invoices */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert(
                  "Tax Invoices",
                  "Invoice #INV-2026-0814 available for download with 18% GST input credit."
                )
              }
            >
              <View style={styles.rowLeft}>
                <FileText size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Invoices</Text>
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

            {/* Language */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() => Alert.alert("Language", "Selected language: English (US)")}
            >
              <View style={styles.rowLeft}>
                <Globe size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Language</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.extraText}>English (US)</Text>
                <ChevronRight size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Dark Mode Switch */}
            <View style={styles.cardRow}>
              <View style={styles.rowLeft}>
                <Moon size={20} color="#334155" strokeWidth={1.8} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#E2E8F0", true: "#0F172A" }}
                thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
              />
            </View>

            <View style={styles.divider} />

            {/* Help Center */}
            <TouchableOpacity
              style={styles.cardRow}
              activeOpacity={0.65}
              onPress={() =>
                Alert.alert("RESTAMP Support", "Reach us at support@restamp.in or call 1800-RESTAMP.")
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
    backgroundColor: "#F8FAFC",
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC",
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
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
    color: "#059669",
  },
  modeSwitchBanner: {
    backgroundColor: "#EEF3FA",
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#C5D5ED",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  modeSwitchContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeSwitchIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DCE6F5",
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
    color: "#4A689B",
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
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
    color: "#059669",
  },
  statusPlan: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EA580C",
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
  extraText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginLeft: 48,
    marginRight: 16,
  },
});
