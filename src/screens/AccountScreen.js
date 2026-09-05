import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useWishlist } from "../context/WishlistContext";

export default function AccountScreen() {
  const { wishlist } = useWishlist();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [currency, setCurrency] = useState("USD ($)");

  const currencies = ["USD ($)", "EUR (€)", "INR (₹)", "GBP (£)"];

  const handleCurrencyChange = () => {
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex]);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to sign out of Tourvaa?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => Alert.alert("Logged Out", "You have successfully signed out."),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
          <Pressable
            style={styles.settingsIconBtn}
            onPress={() => Alert.alert("Settings", "App version 1.0.0 (Tourvaa Pro)")}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
                }}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color={COLORS.white} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Alex Morgan</Text>
                <View style={styles.proPill}>
                  <Text style={styles.proPillText}>Explorer</Text>
                </View>
              </View>
              <Text style={styles.email}>alex.morgan@tourvaa.com</Text>
              <Text style={styles.bio}>Passport stamped in 14 countries 🌍</Text>
            </View>
          </View>

          <Pressable
            style={styles.editProfileBtn}
            onPress={() => Alert.alert("Edit Profile", "Profile editing opened.")}
          >
            <Ionicons name="pencil-outline" size={14} color={COLORS.primary} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Quick Stats Banner */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips Taken</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{wishlist.length}</Text>
            <Text style={styles.statLabel}>Saved Tours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2,450</Text>
            <Text style={styles.statLabel}>Tour Points</Text>
          </View>
        </View>

        {/* Section 1: Travel & Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Travel & Activity</Text>
          <View style={styles.cardGroup}>
            <Pressable
              style={styles.rowItem}
              onPress={() =>
                Alert.alert("My Bookings", "1. Bali Paradise Escape (May 18)\n2. Swiss Alps Rail (June 04)")
              }
            >
              <View style={[styles.iconBox, { backgroundColor: "#E6F4FF" }]}>
                <Ionicons name="airplane-outline" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.rowTitle}>My Bookings</Text>
              <View style={styles.upcomingBadge}>
                <Text style={styles.upcomingBadgeText}>2 Upcoming</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={styles.rowItem}
              onPress={() => Alert.alert("Passports & Visas", "All documents verified.")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#FFF7E6" }]}>
                <Ionicons name="document-text-outline" size={18} color="#FA8C16" />
              </View>
              <Text style={styles.rowTitle}>Travel Documents</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={styles.rowItem}
              onPress={() => Alert.alert("Tourvaa Club", "Silver Tier Member: 15% off next booking")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#F6FFED" }]}>
                <Ionicons name="ribbon-outline" size={18} color={COLORS.success} />
              </View>
              <Text style={styles.rowTitle}>Reward Club</Text>
              <Text style={styles.rowValue}>Silver Tier</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>
          </View>
        </View>

        {/* Section 2: Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.cardGroup}>
            <View style={styles.rowItem}>
              <View style={[styles.iconBox, { backgroundColor: "#F0F5FF" }]}>
                <Ionicons name="notifications-outline" size={18} color="#2F54EB" />
              </View>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#D9D9D9", true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.rowItem}>
              <View style={[styles.iconBox, { backgroundColor: "#FFF0F6" }]}>
                <Ionicons name="location-outline" size={18} color="#EB2F96" />
              </View>
              <Text style={styles.rowTitle}>Location Services</Text>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: "#D9D9D9", true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.rowDivider} />

            <Pressable style={styles.rowItem} onPress={handleCurrencyChange}>
              <View style={[styles.iconBox, { backgroundColor: "#E6FFFB" }]}>
                <Ionicons name="cash-outline" size={18} color="#13C2C2" />
              </View>
              <Text style={styles.rowTitle}>Preferred Currency</Text>
              <Text style={styles.rowValue}>{currency}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>
          </View>
        </View>

        {/* Section 3: Support & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support & Security</Text>
          <View style={styles.cardGroup}>
            <Pressable
              style={styles.rowItem}
              onPress={() => Alert.alert("Payment Methods", "Visa ending in •••• 4242")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#FFF2E8" }]}>
                <Ionicons name="card-outline" size={18} color="#FA541C" />
              </View>
              <Text style={styles.rowTitle}>Payment Methods</Text>
              <Text style={styles.rowValue}>•••• 4242</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>

            <View style={styles.rowDivider} />

            <Pressable
              style={styles.rowItem}
              onPress={() => Alert.alert("Help Center", "Connecting to 24/7 travel concierge...")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#F9F0FF" }]}>
                <Ionicons name="help-circle-outline" size={18} color="#722ED1" />
              </View>
              <Text style={styles.rowTitle}>Help Center & FAQ</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
            </Pressable>
          </View>
        </View>

        {/* Log Out Button */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.appVersion}>Tourvaa v1.0.0 • Built with Expo SDK 57</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  settingsIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  proPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  proPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.primary,
  },
  email: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bio: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F6F8FA",
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 14,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: COLORS.border,
    alignSelf: "center",
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  rowValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  upcomingBadge: {
    backgroundColor: "#FFF0F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  upcomingBadgeText: {
    color: "#EB2F96",
    fontSize: 11,
    fontWeight: "600",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginLeft: 58,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFF1F0",
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#FFCCC7",
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.danger,
  },
  appVersion: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 18,
  },
});