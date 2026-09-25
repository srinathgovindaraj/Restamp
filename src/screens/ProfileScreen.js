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
  CheckCircle2,
  ArrowRight,
  Heart,
  MessageSquare,
  Clock,
  Bell,
  HelpCircle,
  ChevronRight,
  Globe,
  Moon,
  LogOut,
  ShieldCheck,
} from "lucide-react-native";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useWishlist } from "../context/WishlistContext";

export default function ProfileScreen({ navigation }) {
  const nav = useNavigation() || navigation;
  const { wishlist } = useWishlist();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to sign out of RESTAMP?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => Alert.alert("Signed Out", "You have been logged out successfully."),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Jessica Taylor</Text>
            <Text style={styles.userEmail}>jessica.taylor@example.com</Text>
            <View style={styles.badgeBuyer}>
              <CheckCircle2 size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.badgeBuyerText}>Verified Buyer & Owner</Text>
            </View>
          </View>
        </View>

        {/* Post Property Banner */}
        <TouchableOpacity style={styles.postBanner} activeOpacity={0.9}>
          <View style={styles.postBannerContent}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.postBannerTitle}>Post Property FREE</Text>
              <Text style={styles.postBannerSub}>
                Sell or Rent your property to thousands of buyers online
              </Text>
            </View>
            <View style={styles.postBtn}>
              <Text style={styles.postBtnText}>Post Now</Text>
              <ArrowRight size={13} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* 1. Buyer & Tenant Services */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeaderTitle}>Buyer & Tenant Services</Text>

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.65}
            onPress={() => nav.navigate("Saved")}
          >
            <View style={styles.menuLeft}>
              <Heart size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Saved Shortlists</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {wishlist?.length > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{wishlist.length}</Text>
                </View>
              )}
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.65}
            onPress={() => nav.navigate("Search")}
          >
            <View style={styles.menuLeft}>
              <Clock size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Recent Searches</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionDivider} />

        {/* 2. Settings & Preferences */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeaderTitle}>Settings & Preferences</Text>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.65}>
            <View style={styles.menuLeft}>
              <Bell size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Notification</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.65}>
            <View style={styles.menuLeft}>
              <ShieldCheck size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Security</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.65}>
            <View style={styles.menuLeft}>
              <Globe size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Language</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuExtraText}>English (US)</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Moon size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#E2E8F0", true: COLORS.primary }}
              thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
            />
          </View>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.65}>
            <View style={styles.menuLeft}>
              <HelpCircle size={21} color="#334155" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>Help Center</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.65}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <LogOut size={21} color="#EF4444" strokeWidth={1.8} style={styles.menuIcon} />
              <Text style={[styles.menuLabel, { color: "#EF4444" }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 6,
  },
  badgeBuyer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  badgeBuyerText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  postBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
  },
  postBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postBannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 3,
  },
  postBannerSub: {
    fontSize: 11.5,
    color: "#94A3B8",
    lineHeight: 15,
  },
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  postBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
    marginVertical: 4,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 8,
    marginBottom: 4,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuExtraText: {
    fontSize: 13.5,
    color: "#64748B",
    marginRight: 8,
    fontWeight: "400",
  },
  menuBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
