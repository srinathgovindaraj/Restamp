import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  CheckCircle2,
  ArrowRight,
  Heart,
  MessageSquare,
  Home,
  Bell,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";
import COLORS from "../constants/colors";

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Card */}
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
              <CheckCircle2 size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.badgeBuyerText}>Verified Buyer & Owner</Text>
            </View>
          </View>
        </View>

        {/* Post Property Banner (Sell / Rent like 99acres) */}
        <TouchableOpacity style={styles.postBanner} activeOpacity={0.9}>
          <View style={styles.postBannerContent}>
            <Text style={styles.postBannerTitle}>Want to Sell or Rent your Property?</Text>
            <Text style={styles.postBannerSub}>Post your property for FREE and reach thousands of buyers</Text>
            <View style={styles.postBtn}>
              <Text style={styles.postBtnText}>Post Property FREE</Text>
              <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Menu Options */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Property Hub</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Saved")}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: "#FFF0F0" }]}>
              <Heart size={20} color={COLORS.heartRed} fill={COLORS.heartRed} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Saved Shortlists</Text>
              <Text style={styles.menuSub}>View saved villas, apartments & houses</Text>
            </View>
            <ChevronRight size={18} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#EBF4FF" }]}>
              <MessageSquare size={20} color={COLORS.primary} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>My Enquiries & Leads</Text>
              <Text style={styles.menuSub}>Recent calls and messages sent to agents</Text>
            </View>
            <ChevronRight size={18} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#F0FDF4" }]}>
              <Home size={20} color="#16A34A" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>My Posted Properties</Text>
              <Text style={styles.menuSub}>Manage active listings for sale or rent</Text>
            </View>
            <ChevronRight size={18} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        {/* Settings & Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings & Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#F8FAFC" }]}>
              <Bell size={20} color={COLORS.textDark} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Property Alerts & Notifications</Text>
              <Text style={styles.menuSub}>Price drop alerts & new matches</Text>
            </View>
            <ChevronRight size={18} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#F8FAFC" }]}>
              <HelpCircle size={20} color={COLORS.textDark} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Help & Support</Text>
              <Text style={styles.menuSub}>FAQ, customer care & feedback</Text>
            </View>
            <ChevronRight size={18} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  badgeBuyer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeBuyerText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  postBanner: {
    margin: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  postBannerContent: {
    alignItems: "flex-start",
  },
  postBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  postBannerSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.88)",
    marginBottom: 14,
    lineHeight: 16,
  },
  postBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  postBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  menuSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
