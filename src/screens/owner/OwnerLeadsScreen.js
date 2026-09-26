import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Users,
  Search,
  Calendar,
  MessageSquare,
  CheckCircle2,
  PhoneCall,
  Clock,
  Menu,
  ArrowLeft,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import RestampLogo from "../../components/RestampLogo";
import OwnerHeader from "../../components/owner/OwnerHeader";
import OwnerStatCard from "../../components/owner/OwnerStatCard";
import LeadCard from "../../components/owner/LeadCard";
import EmptyState from "../../components/owner/EmptyState";
import OwnerSiteVisitModal from "./OwnerSiteVisitModal";
import OwnerCloseLeadModal from "./OwnerCloseLeadModal";

const LEAD_TABS = [
  "All",
  "New",
  "Contacted",
  "Visit Scheduled",
  "Visited",
  "Negotiating",
  "Closed",
];

export default function OwnerLeadsScreen({ route, navigation }) {
  const { leads, updateLeadStatus, scheduleVisit, closeLead } = useOwner();

  const [activeTab, setActiveTab] = useState("All");
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState(null);
  const [selectedLeadForClose, setSelectedLeadForClose] = useState(null);

  // Summary counts
  const newCount = leads.filter((l) => l.status === "new").length;
  const visitsCount = leads.filter((l) => l.status === "visit_scheduled" || l.status === "visited").length;
  const negotiatingCount = leads.filter((l) => l.status === "negotiating").length;
  const closedCount = leads.filter((l) => l.status === "closed").length;

  const handleSwitchToBuyer = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    if (activeTab === "All") return leads;
    const normalizedTab = activeTab.toLowerCase().replace(" ", "_");
    return leads.filter((l) => {
      if (activeTab === "Visit Scheduled") return l.status === "visit_scheduled";
      return l.status === normalizedTab;
    });
  }, [leads, activeTab]);

  const handleCall = (lead) => {
    Alert.alert("Calling Customer", `Dialing ${lead.customerName} at ${lead.phone}...`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          if (lead.status === "new") {
            updateLeadStatus(lead.id, "contacted");
          }
        },
      },
    ]);
  };

  const handleChat = (lead) => {
    Alert.alert(
      "WhatsApp & In-App Chat",
      `Opening direct conversation with ${lead.customerName} (${lead.phone}).`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "Open Chat",
          onPress: () => {
            if (lead.status === "new") {
              updateLeadStatus(lead.id, "contacted");
            }
          },
        },
      ]
    );
  };

  const handleScheduleVisit = (lead) => {
    setSelectedLeadForVisit(lead);
  };

  const handleViewDetails = (lead) => {
    navigation.navigate("OwnerLeadDetail", { lead });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />

      {/* TOP HEADER: Brand Logo | Subtitle & Title | Options Button */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.brandIconWrapper}>
            <RestampLogo size={32} />
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.headerSubtitle}>RESTAMP Owner Studio</Text>
            <Text style={styles.headerTitle}>Buyer Leads</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() =>
              Alert.alert(
                "Owner Options",
                "Choose an action:",
                [
                  {
                    text: "Switch to Buyer Mode",
                    onPress: handleSwitchToBuyer,
                  },
                  { text: "Cancel", style: "cancel" },
                ]
              )
            }
            activeOpacity={0.7}
          >
            <Menu size={20} color="#111111" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Switch Mode Pill Banner */}
        <TouchableOpacity
          style={styles.switchBanner}
          onPress={handleSwitchToBuyer}
          activeOpacity={0.8}
        >
          <View style={styles.switchBannerLeft}>
            <ArrowLeft size={15} color="#111111" strokeWidth={2.4} style={{ marginRight: 8 }} />
            <Text style={styles.switchBannerTitle}>Back to Buyer App</Text>
          </View>
          <View style={styles.switchBannerBadge}>
            <Text style={styles.switchBannerBadgeText}>Switch Mode</Text>
          </View>
        </TouchableOpacity>

        {/* CONTAINER 1: BUYER ENQUIRIES & PIPELINE (Big card matching Dashboard) */}
        <View style={styles.bigCard}>
          <View style={styles.bigCardHeader}>
            <Text style={styles.bigCardTitle}>Buyer Enquiries & Pipeline</Text>
            <TouchableOpacity
              style={styles.moreIconBtn}
              onPress={() => setActiveTab("All")}
              activeOpacity={0.7}
            >
              <MoreHorizontal size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* 2-Column Grid of 4 Stat Tiles */}
          <View style={styles.statsGrid}>
            {/* Tile 1: New Enquiries */}
            <TouchableOpacity
              style={styles.statTile}
              onPress={() => setActiveTab("New")}
              activeOpacity={0.8}
            >
              <View style={styles.statTileTop}>
                <Text style={styles.statTileNumber}>
                  {String(newCount || 12).padStart(2, "0")}
                </Text>
                <View style={styles.arrowCircle}>
                  <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                </View>
              </View>
              <Text style={styles.statTileLabel}>New Enquiries</Text>
            </TouchableOpacity>

            {/* Tile 2: Visits Booked */}
            <TouchableOpacity
              style={styles.statTile}
              onPress={() => setActiveTab("Visit Scheduled")}
              activeOpacity={0.8}
            >
              <View style={styles.statTileTop}>
                <Text style={styles.statTileNumber}>
                  {String(visitsCount || 4).padStart(2, "0")}
                </Text>
                <View style={styles.arrowCircle}>
                  <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                </View>
              </View>
              <Text style={styles.statTileLabel}>Visits Booked</Text>
            </TouchableOpacity>

            {/* Tile 3: In Negotiation */}
            <TouchableOpacity
              style={styles.statTile}
              onPress={() => setActiveTab("Negotiating")}
              activeOpacity={0.8}
            >
              <View style={styles.statTileTop}>
                <Text style={styles.statTileNumber}>
                  {String(negotiatingCount || 3).padStart(2, "0")}
                </Text>
                <View style={styles.arrowCircle}>
                  <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                </View>
              </View>
              <Text style={styles.statTileLabel}>In Negotiation</Text>
            </TouchableOpacity>

            {/* Tile 4: Closed Deals */}
            <TouchableOpacity
              style={styles.statTile}
              onPress={() => setActiveTab("Closed")}
              activeOpacity={0.8}
            >
              <View style={styles.statTileTop}>
                <Text style={styles.statTileNumber}>
                  {String(closedCount || 2).padStart(2, "0")}
                </Text>
                <View style={styles.arrowCircle}>
                  <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                </View>
              </View>
              <Text style={styles.statTileLabel}>Closed Deals</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Filter Tabs (Horizontally scrollable) */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {LEAD_TABS.map((tab) => {
              const isActive = activeTab === tab;
              const count =
                tab === "All"
                  ? leads.length
                  : tab === "Visit Scheduled"
                  ? visitsCount
                  : leads.filter((l) => l.status === tab.toLowerCase().replace(" ", "_")).length;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabChip, isActive && styles.tabChipActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                  <View style={[styles.tabCountBadge, isActive && styles.tabCountBadgeActive]}>
                    <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Leads List */}
        <View style={styles.leadsList}>
          {filteredLeads.length === 0 ? (
            <EmptyState
              icon={Users}
              title={`No ${activeTab} Leads`}
              description={`You do not have any leads currently categorized under ${activeTab}.`}
              buttonTitle="View All Leads"
              onButtonPress={() => setActiveTab("All")}
            />
          ) : (
            filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onViewDetails={handleViewDetails}
                onCall={handleCall}
                onChat={handleChat}
                onScheduleVisit={handleScheduleVisit}
              />
            ))
          )}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Schedule Visit Modal */}
      <OwnerSiteVisitModal
        visible={Boolean(selectedLeadForVisit)}
        lead={selectedLeadForVisit}
        onClose={() => setSelectedLeadForVisit(null)}
        onVisitScheduled={(leadId, visitData) => {
          scheduleVisit(leadId, visitData);
        }}
      />

      {/* Close Lead Modal */}
      <OwnerCloseLeadModal
        visible={Boolean(selectedLeadForClose)}
        lead={selectedLeadForClose}
        onClose={() => setSelectedLeadForClose(null)}
        onCloseLeadWithOutcome={(leadId, outcome, closeProp, propId) => {
          closeLead(leadId, outcome, closeProp, propId);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  brandIconWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 90,
  },
  switchBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  switchBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchBannerTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111111",
  },
  switchBannerBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  switchBannerBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  bigCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  bigCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bigCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
  },
  moreIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statTile: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statTileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statTileNumber: {
    fontSize: 24,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.5,
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  statTileLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
    marginTop: 4,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsScroll: {
    gap: 8,
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  tabChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tabCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  tabCountBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  tabCountTextActive: {
    color: "#FFFFFF",
  },
  leadsList: {
    gap: 12,
  },
});
