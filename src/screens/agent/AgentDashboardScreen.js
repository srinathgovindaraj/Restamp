import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Platform,
} from "react-native";
import {
  Briefcase,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Bell,
  Sparkles,
  ArrowUpRight,
  Crown,
  AlertTriangle,
  RotateCcw,
  X,
  Phone,
  MessageSquare,
  Eye,
  SlidersHorizontal,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useAgent } from "../../context/AgentContext";
import RestampLogo from "../../components/RestampLogo";

export default function AgentDashboardScreen({ navigation }) {
  const {
    agentPlan,
    selectedLocalities,
    agentProfile,
    leads,
    visits,
    isPlanExpired,
    localityProperties,
    renewPlan,
  } = useAgent();

  const [locationsModalVisible, setLocationsModalVisible] = useState(false);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 👋";
    if (hour < 17) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  const recentLeads = leads.slice(0, 3);
  const todaysVisits = visits.filter((v) => v.date === "Today" && v.status === "upcoming");

  const handleManagePlan = () => {
    navigation.navigate("Menu", { initialTab: "agent" });
  };

  const handleViewAllLocations = () => {
    setLocationsModalVisible(true);
  };

  const handleLeadPress = (lead) => {
    navigation.navigate("AgentLeadDetail", { lead });
  };

  const handleSwitchToBuyer = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.brandIconWrapper}>
            <RestampLogo size={28} />
          </View>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerGreeting}>{getGreeting()}</Text>
            <Text style={styles.headerAgentName}>
              {agentProfile?.name || "Vikram Prabhu"}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() =>
              Alert.alert(
                "Notifications",
                "• 2 New buyer inquiries in Anna Nagar\n• Site visit reminder for Suresh Babu today at 4:30 PM\n• New owner listed 3 BHK in Kilpauk"
              )
            }
            activeOpacity={0.75}
          >
            <Bell size={19} color="#0F172A" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerAvatarBtn}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  agentProfile?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
              }}
              style={styles.headerAvatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* EXPIRED PLAN BANNER (IF EXPIRED) */}
        {isPlanExpired && (
          <View style={styles.expiredBanner}>
            <View style={styles.expiredLeft}>
              <AlertTriangle size={20} color="#DC2626" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.expiredTitle}>Your Agent Plan has expired.</Text>
                <Text style={styles.expiredSub}>
                  Renew to unlock new property listings and fresh buyer lead alerts.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.renewBtn} onPress={handleManagePlan} activeOpacity={0.8}>
              <Text style={styles.renewBtnText}>Renew Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SECTION 1: CURRENT PLAN CARD */}
        <View style={styles.planCard}>
          <View style={styles.planTopRow}>
            <View style={styles.planInfo}>
              <View style={styles.planBadgeRow}>
                <Crown size={14} color={COLORS.primary} style={{ marginRight: 5 }} />
                <Text style={styles.planName}>{agentPlan?.name || "Agent Pro"}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {agentPlan?.status === "active" ? "Active" : "Expired"}
                  </Text>
                </View>
              </View>
              <Text style={styles.planMeta}>
                {agentPlan?.locationLimit || selectedLocalities.length} Locations Coverage •{" "}
                <Text style={{ fontWeight: "700", color: "#0F172A" }}>
                  {agentPlan?.daysRemaining || 24} Days Remaining
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.managePlanBtn}
              onPress={handleManagePlan}
              activeOpacity={0.8}
            >
              <Text style={styles.managePlanBtnText}>Manage Plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 2: LOCATION COVERAGE */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTitleGroup}>
              <MapPin size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.cardTitle}>Your Locations</Text>
              <View style={styles.locCountTag}>
                <Text style={styles.locCountTagText}>
                  {selectedLocalities.length}/{agentPlan?.locationLimit || 10}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleViewAllLocations} activeOpacity={0.7}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardHelperText}>
            You receive property matches and buyer leads exclusively in these locations:
          </Text>

          <View style={styles.localityChipsWrap}>
            {selectedLocalities.slice(0, 5).map((loc) => (
              <View key={loc} style={styles.localityChip}>
                <Text style={styles.localityChipText}>{loc}</Text>
              </View>
            ))}
            {selectedLocalities.length > 5 && (
              <TouchableOpacity
                style={styles.localityMoreChip}
                onPress={handleViewAllLocations}
                activeOpacity={0.8}
              >
                <Text style={styles.localityMoreChipText}>
                  +{selectedLocalities.length - 5} More
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* SECTION 3: QUICK SUMMARY METRICS */}
        <View style={styles.metricsGrid}>
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("Properties")}
            activeOpacity={0.8}
          >
            <View style={[styles.metricIconBox, { backgroundColor: "#EFF6FF" }]}>
              <Building2 size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.metricValue}>{localityProperties.length || 126}</Text>
            <Text style={styles.metricLabel}>Available Properties</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("Leads")}
            activeOpacity={0.8}
          >
            <View style={[styles.metricIconBox, { backgroundColor: "#F0FDF4" }]}>
              <Users size={18} color="#16A34A" />
            </View>
            <Text style={styles.metricValue}>{leads.length || 18}</Text>
            <Text style={styles.metricLabel}>Active Leads</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("Visits")}
            activeOpacity={0.8}
          >
            <View style={[styles.metricIconBox, { backgroundColor: "#FFF7ED" }]}>
              <Calendar size={18} color="#EA580C" />
            </View>
            <Text style={styles.metricValue}>
              {todaysVisits.length > 0 ? todaysVisits.length : 4}
            </Text>
            <Text style={styles.metricLabel}>Visits Today</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.8}
          >
            <View style={[styles.metricIconBox, { backgroundColor: "#FAF5FF" }]}>
              <Sparkles size={18} color="#9333EA" />
            </View>
            <Text style={styles.metricValue}>{agentProfile?.dealsClosedCount || 7}</Text>
            <Text style={styles.metricLabel}>Closed Deals</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 4: QUICK ACTION BUTTONS */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate("Properties")}
            activeOpacity={0.85}
          >
            <Building2 size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.quickActionBtnText}>View Properties</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate("Leads")}
            activeOpacity={0.85}
          >
            <Users size={16} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.quickActionBtnText}>View Leads</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => navigation.navigate("Visits")}
            activeOpacity={0.85}
          >
            <Calendar size={16} color="#EA580C" style={{ marginRight: 6 }} />
            <Text style={styles.quickActionBtnText}>Today's Visits</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 5: RECENT LEADS */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Recent Leads</Text>
              <View style={styles.badgeNew}>
                <Text style={styles.badgeNewText}>Direct Inquiries</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Leads")}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.linkText}>View All</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.leadsList}>
            {recentLeads.map((lead) => (
              <TouchableOpacity
                key={lead.id}
                style={styles.leadCard}
                onPress={() => handleLeadPress(lead)}
                activeOpacity={0.88}
              >
                <View style={styles.leadTopRow}>
                  <Image source={{ uri: lead.avatar }} style={styles.leadAvatar} />
                  <View style={styles.leadInfo}>
                    <Text style={styles.leadCustomerName}>{lead.customerName}</Text>
                    <Text style={styles.leadRequirement} numberOfLines={1}>
                      {lead.requirement} • {lead.preferredLocality}
                    </Text>
                  </View>
                  <View style={styles.leadStatusPill}>
                    <Text style={styles.leadStatusText}>
                      {lead.status.replace("_", " ").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.leadDivider} />

                <View style={styles.leadBottomRow}>
                  <View style={styles.leadBudgetCol}>
                    <Text style={styles.leadBudgetLabel}>Budget</Text>
                    <Text style={styles.leadBudgetValue}>{lead.budget}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewLeadBtn}
                    onPress={() => handleLeadPress(lead)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewLeadBtnText}>View Lead</Text>
                    <ArrowUpRight size={13} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* LOCATIONS MODAL DIALOG */}
      <Modal
        visible={locationsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLocationsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationsModalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Your Covered Locations</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedLocalities.length} of {agentPlan?.locationLimit || 10} locations assigned
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setLocationsModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.modalLocGrid}>
                {selectedLocalities.map((loc, idx) => (
                  <View key={loc} style={styles.modalLocItem}>
                    <View style={styles.modalLocIndex}>
                      <Text style={styles.modalLocIndexText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.modalLocName}>{loc}</Text>
                    <CheckCircle2 size={16} color="#16A34A" />
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setLocationsModalVisible(false)}
                activeOpacity={0.88}
              >
                <Text style={styles.modalDoneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIconWrapper: {
    marginRight: 10,
  },
  headerTitleGroup: {},
  headerGreeting: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  headerAgentName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#DC2626",
  },
  headerAvatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    overflow: "hidden",
  },
  headerAvatar: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  expiredBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expiredLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  expiredTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#991B1B",
  },
  expiredSub: {
    fontSize: 11,
    color: "#B91C1C",
    marginTop: 2,
  },
  renewBtn: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  renewBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  planTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planInfo: {
    flex: 1,
    marginRight: 10,
  },
  planBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  planName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statusBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  planMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  managePlanBtn: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  managePlanBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  locCountTag: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  locCountTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardHelperText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 17,
  },
  localityChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  localityChip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  localityChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  localityMoreChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  localityMoreChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  metricLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  quickActionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  recentSection: {
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  badgeNew: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeNewText: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  leadsList: {
    gap: 10,
  },
  leadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  leadTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  leadAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  leadInfo: {
    flex: 1,
  },
  leadCustomerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  leadRequirement: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  leadStatusPill: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leadStatusText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#16A34A",
  },
  leadDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },
  leadBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leadBudgetCol: {},
  leadBudgetLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  leadBudgetValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 1,
  },
  viewLeadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 4,
  },
  viewLeadBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  locationsModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    maxHeight: 340,
  },
  modalLocGrid: {
    gap: 8,
  },
  modalLocItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalLocIndex: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalLocIndexText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  modalLocName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  modalFooter: {
    marginTop: 16,
  },
  modalDoneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalDoneBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
