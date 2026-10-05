import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  MessageSquare,
  Phone,
  Eye,
  Building2,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react-native";

import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import RestampLogo from "../../components/RestampLogo";

export default function OwnerDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const { properties, leads, subscription, ownerProfile } = useOwner();

  // Calculate summary counts
  const activeCount = properties.filter((p) => p.status === "active").length;
  const pendingCount = properties.filter((p) => p.status === "pending").length;
  const closedCount = properties.filter((p) => p.status === "closed").length;

  // Aggregate performance stats
  const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalEnquiries = properties.reduce((acc, p) => acc + (p.enquiries || 0), 0);
  const totalVisits = properties.reduce((acc, p) => acc + (p.visits || 0), 0);

  // Latest leads & primary property
  const recentLeads = leads.slice(0, 3);
  const primaryProperty = properties.find((p) => p.status === "active") || properties[0];

  // Dynamic date matching reference design ("Wednesday, 11 May")
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  const ownerName = ownerProfile?.firstName || "Arunavo";

  const handleAddProperty = () => {
    navigation.navigate("Add", { resetForm: Date.now(), initialStep: 1 });
  };

  const handleMyProperties = (tab = "Active") => {
    navigation.navigate("Properties", { initialTab: tab });
  };

  const handleViewLeads = () => {
    navigation.navigate("Leads");
  };

  const handleManagePlan = () => {
    navigation.navigate("OwnerPlans");
  };

  const handleSwitchToBuyer = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <View style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ================= FIXED BRAND HEADER (Like Buyer Page) ================= */}
      <View style={[styles.headerWrapper, { paddingTop: topInset }]}>
        <View style={styles.header}>
          {/* Left Side Restamp Logotype */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIconBg}>
              <RestampLogo size={30} />
            </View>
            <Text style={styles.logoText}>
              Res<Text style={styles.logoTextAccent}>tamp</Text>
            </Text>
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>OWNER</Text>
            </View>
          </View>

          {/* Right Side Actions: Switch to Buyer & Notification Bell */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.switchModePill}
              onPress={handleSwitchToBuyer}
              activeOpacity={0.75}
            >
              <ArrowLeft size={13} color="#0F172A" style={{ marginRight: 4 }} />
              <Text style={styles.switchModeText}>Buyer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert("Notifications", "You have no unread notifications.")}
            >
              <Bell size={20} color="#0F172A" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. GREETING SECTION (Matches reference photo: Date / Good morning / Arunavo,) */}
        <View style={styles.greetingSection}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
          <Text style={styles.greetingMainText}>{greetingText}</Text>
          <Text style={styles.greetingSubName}>{ownerName},</Text>
        </View>

        {/* 2. TOP FEATURE / STATUS CARD: Primary Active Listing */}
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => {
            if (primaryProperty) {
              handleMyProperties("Active");
            } else {
              handleAddProperty();
            }
          }}
          activeOpacity={0.88}
        >
          <View style={styles.featureLeftCol}>
            <Text style={styles.featureCardSub}>
              {primaryProperty ? "Primary Listing" : "Quick Action"}
            </Text>
            <Text style={styles.featureCardTitle} numberOfLines={1}>
              {primaryProperty?.title || "Add Your First Property"}
            </Text>
          </View>

          <View style={styles.featureRightCol}>
            <View style={[styles.nowBadge, primaryProperty ? styles.liveBadge : styles.startBadge]}>
              <Text style={styles.nowBadgeText}>
                {primaryProperty ? "Live" : "Start"}
              </Text>
            </View>
            <ArrowRight size={18} color="#475569" style={{ marginLeft: 10 }} />
          </View>
        </TouchableOpacity>

        {/* 3. 2-COLUMN METRICS GRID: Real Estate Stats */}
        {/* Row 1: Active Listings & Pending Verification */}
        <View style={styles.metricsGrid}>
          {/* Card 1: Active Listings */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => handleMyProperties("Active")}
            activeOpacity={0.85}
          >
            <View style={styles.metricCardTop}>
              <Building2 size={22} color="#0F172A" strokeWidth={1.8} />
              <ArrowRight size={17} color="#8E9BAE" />
            </View>
            <Text style={styles.metricNumber}>
              {String(activeCount).padStart(2, "0")}
            </Text>
            <Text style={styles.metricLabel}>Active listings</Text>
          </TouchableOpacity>

          {/* Card 2: Pending Verification */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => handleMyProperties("Pending")}
            activeOpacity={0.85}
          >
            <View style={styles.metricCardTop}>
              <Clock size={22} color="#0F172A" strokeWidth={1.8} />
              <ArrowRight size={17} color="#8E9BAE" />
            </View>
            <Text style={styles.metricNumber}>
              {String(pendingCount).padStart(2, "0")}
            </Text>
            <Text style={styles.metricLabel}>Pending verification</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Total Inquiries & Property Views */}
        <View style={[styles.metricsGrid, { marginTop: 12 }]}>
          {/* Card 3: Total Inquiries */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={handleViewLeads}
            activeOpacity={0.85}
          >
            <View style={styles.metricCardTop}>
              <MessageSquare size={22} color="#0F172A" strokeWidth={1.8} />
              <ArrowRight size={17} color="#8E9BAE" />
            </View>
            <Text style={styles.metricNumber}>{totalEnquiries || 14}</Text>
            <Text style={styles.metricLabel}>Total inquiries</Text>
          </TouchableOpacity>

          {/* Card 4: Property Views */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => handleMyProperties("Active")}
            activeOpacity={0.85}
          >
            <View style={styles.metricCardTop}>
              <Eye size={22} color="#0F172A" strokeWidth={1.8} />
              <ArrowRight size={17} color="#8E9BAE" />
            </View>
            <Text style={styles.metricNumber}>
              {totalViews > 0 ? totalViews.toLocaleString("en-IN") : "1,248"}
            </Text>
            <Text style={styles.metricLabel}>Property views</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3: Site Visits & Closed Listings */}
        <View style={[styles.metricsGrid, { marginTop: 12 }]}>
          {/* Card 5: Site Visits Booked */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={handleViewLeads}
            activeOpacity={0.85}
          >
            <View style={styles.metricCardTop}>
              <Calendar size={22} color="#0F172A" strokeWidth={1.8} />
              <ArrowRight size={17} color="#8E9BAE" />
            </View>
            <Text style={styles.metricNumber}>
              {String(totalVisits || 6).padStart(2, "0")}
            </Text>
            <Text style={styles.metricLabel}>Site visits booked</Text>
          </TouchableOpacity>

          {/* Card 6: Closed Listings */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => handleMyProperties("Closed")}
            activeOpacity={0.85}
          >
            <View style={styles.metricCardTop}>
              <ShieldCheck size={22} color="#0F172A" strokeWidth={1.8} />
              <ArrowRight size={17} color="#8E9BAE" />
            </View>
            <Text style={styles.metricNumber}>
              {String(closedCount).padStart(2, "0")}
            </Text>
            <Text style={styles.metricLabel}>Closed listings</Text>
          </TouchableOpacity>
        </View>

        {/* 4. QUICK ACTION BANNER: + List New Property */}
        <TouchableOpacity
          style={styles.addPropertyBanner}
          onPress={handleAddProperty}
          activeOpacity={0.88}
        >
          <View style={styles.addBannerLeft}>
            <View style={styles.addBannerIconWrap}>
              <Plus size={20} color="#FFFFFF" strokeWidth={2.6} />
            </View>
            <View>
              <Text style={styles.addBannerTitle}>List a New Property</Text>
              <Text style={styles.addBannerSub}>
                Add rental, lease, or resale property in minutes
              </Text>
            </View>
          </View>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* 5. RECENT ENQUIRIES / LEADS (Minimal Streamlined List) */}
        <View style={styles.minimalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Enquiries</Text>
            <TouchableOpacity
              onPress={handleViewLeads}
              activeOpacity={0.7}
              style={styles.viewAllRow}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <ArrowRight size={14} color={COLORS.primary} style={{ marginLeft: 3 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.minimalListCard}>
            {recentLeads.map((lead, idx) => (
              <TouchableOpacity
                key={lead.id || idx}
                style={[
                  styles.leadRow,
                  idx !== recentLeads.length - 1 && styles.leadRowDivider,
                ]}
                onPress={() => navigation.navigate("OwnerLeadDetail", { lead })}
                activeOpacity={0.7}
              >
                <Image
                  source={{
                    uri:
                      lead.avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                  }}
                  style={styles.leadAvatar}
                />

                <View style={styles.leadInfo}>
                  <View style={styles.leadNameRow}>
                    <Text style={styles.leadName}>{lead.customerName}</Text>
                    <Text style={styles.leadTimeText}>
                      {lead.timestamp || "Today"}
                    </Text>
                  </View>
                  <Text style={styles.leadPropertyText} numberOfLines={1}>
                    {lead.propertyTitle} • {lead.budget || "Budget verified"}
                  </Text>
                  <Text style={styles.leadSnippet} numberOfLines={1}>
                    Interested in site visit this weekend
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.leadCallBtn}
                  onPress={() => Alert.alert("Call", `Dialing ${lead.phone || "+91 98765 43210"}`)}
                  activeOpacity={0.7}
                >
                  <Phone size={14} color="#0F172A" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 6. OWNER PLAN & QUOTA (Minimal Card) */}
        <View style={styles.minimalSection}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ShieldCheck size={18} color="#16A34A" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Owner Plan</Text>
            </View>
            <View style={styles.planStatusPill}>
              <Text style={styles.planStatusText}>Active</Text>
            </View>
          </View>

          <View style={styles.minimalListCard}>
            <View style={styles.planRowItem}>
              <Text style={styles.planKey}>Current Plan</Text>
              <Text style={styles.planVal}>{subscription?.planName || "Owner Pro Plan"}</Text>
            </View>
            <View style={styles.planRowDivider} />
            <View style={styles.planRowItem}>
              <Text style={styles.planKey}>Validity</Text>
              <Text style={styles.planVal}>{subscription?.validity || "Until Leased / Sold"}</Text>
            </View>
            <View style={styles.planRowDivider} />
            <View style={styles.planRowItem}>
              <Text style={styles.planKey}>Listing Quota</Text>
              <Text style={styles.planVal}>
                {activeCount} of {subscription?.listingLimit || 5} used
              </Text>
            </View>

            <TouchableOpacity
              style={styles.managePlanBtn}
              onPress={handleManagePlan}
              activeOpacity={0.8}
            >
              <Text style={styles.managePlanBtnText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
    backgroundColor: "#FFFFFF",
  },
  headerWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 100,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIconBg: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  logoTextAccent: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  ownerBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.6,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchModePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  switchModeText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  // 2. Greeting Section (Matching reference photo: "Good morning / Arunavo,")
  greetingSection: {
    marginBottom: 20,
    marginTop: 14,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E9BAE",
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  greetingMainText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  greetingSubName: {
    fontSize: 32,
    fontWeight: "600",
    color: "#8E9BAE",
    letterSpacing: -0.6,
    lineHeight: 38,
    marginTop: 2,
  },

  // 3. Feature Status Card (Matching reference photo: "Current Meeting / Budget Review / now ->")
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  featureLeftCol: {
    flex: 1,
    marginRight: 12,
  },
  featureCardSub: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E9BAE",
    marginBottom: 5,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  featureRightCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  nowBadge: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  liveBadge: {
    backgroundColor: "#16A34A",
  },
  startBadge: {
    backgroundColor: COLORS.primary,
  },
  nowBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // 4. 2-Column Metrics Grid (Matching reference photo)
  metricsGrid: {
    flexDirection: "row",
    gap: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  metricCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
  },
  metricLabel: {
    fontSize: 13.5,
    fontWeight: "500",
    color: "#8E9BAE",
    marginTop: 4,
  },

  // 4. Quick Action Banner
  addPropertyBanner: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  addBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  addBannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addBannerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  addBannerSub: {
    color: "#94A3B8",
    fontSize: 11.5,
    marginTop: 2,
  },

  // 5. Minimal List Sections
  minimalSection: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  minimalListCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    overflow: "hidden",
  },
  leadRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  leadRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  leadInfo: {
    flex: 1,
    marginRight: 10,
  },
  leadNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  leadName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  leadTimeText: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  leadPropertyText: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  leadSnippet: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 2,
  },
  leadCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  // Plan Details
  planStatusPill: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  planRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  planRowDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
  planKey: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  planVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  managePlanBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  managePlanBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
});
