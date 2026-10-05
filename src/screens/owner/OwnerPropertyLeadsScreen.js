import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Eye,
  Building2,
  MapPin,
  ChevronRight,
  UserCheck,
  CheckCircle2,
} from "lucide-react-native";

import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import StatusBadge from "../../components/owner/StatusBadge";
import EmptyState from "../../components/owner/EmptyState";
import OwnerSiteVisitModal from "./OwnerSiteVisitModal";
import OwnerCloseLeadModal from "./OwnerCloseLeadModal";

const LEAD_TABS = [
  "All",
  "New",
  "Contacted",
  "Visit Scheduled",
  "Negotiating",
  "Closed",
];

export default function OwnerPropertyLeadsScreen({ route, navigation }) {
  const { properties, leads, updateLeadStatus, scheduleVisit, closeLead } = useOwner();

  // Selected property passed from My Properties
  const routeProperty = route?.params?.property;
  const routePropertyId = route?.params?.propertyId || routeProperty?.id;

  const property = useMemo(() => {
    if (routeProperty) return routeProperty;
    if (routePropertyId) {
      return properties.find((p) => p.id === routePropertyId) || properties[0];
    }
    return properties[0] || null;
  }, [routeProperty, routePropertyId, properties]);

  const [activeTab, setActiveTab] = useState("All");
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState(null);
  const [selectedLeadForClose, setSelectedLeadForClose] = useState(null);

  // Filter leads specifically for this property
  const projectLeads = useMemo(() => {
    if (!property) return leads;

    const matched = leads.filter(
      (l) =>
        l.propertyId === property.id ||
        (l.propertyTitle &&
          property.title &&
          l.propertyTitle.toLowerCase() === property.title.toLowerCase())
    );

    // If matching leads exist, use them
    if (matched.length > 0) return matched;

    // Fallback contextual mock leads for this specific property
    const formattedPrice =
      property.priceFormatted ||
      (property.price
        ? `₹${property.price.toLocaleString("en-IN")}${property.priceUnit || ""}`
        : "₹25,000 / month");

    return [
      {
        id: `gen-lead-${property.id}-1`,
        customerName: "Arun Kumar",
        phone: "+91 98840 12345",
        email: "arun.kumar@gmail.com",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocality: `${property.locality || "Anna Nagar"}, Chennai`,
        propertyPrice: formattedPrice,
        propertyImage: property.coverPhoto || property.images?.[0],
        requirement: property.purpose || "Rent",
        budget: formattedPrice,
        status: "new",
        timestamp: "Today • 10:35 AM",
        preferredVisitDate: "Tomorrow, 11:00 AM",
        message: `Hi, I am interested in your ${property.title}. Move-in planned this month. Can we schedule an in-person visit?`,
        visitData: null,
      },
      {
        id: `gen-lead-${property.id}-2`,
        customerName: "Priya Sundaram",
        phone: "+91 97910 88231",
        email: "priya.s@techcorp.in",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocality: `${property.locality || "Anna Nagar"}, Chennai`,
        propertyPrice: formattedPrice,
        propertyImage: property.coverPhoto || property.images?.[0],
        requirement: property.purpose || "Rent",
        budget: formattedPrice,
        status: "visit_scheduled",
        timestamp: "Yesterday • 4:15 PM",
        preferredVisitDate: "Saturday, 4:00 PM",
        message: `Photos look fantastic! Looking forward to viewing the ${property.title} this weekend with my family.`,
        visitData: {
          date: "Saturday, 28 Sep",
          time: "4:00 PM",
          note: "Family visit confirmed. Wants to check parking and kitchen layout.",
        },
      },
      {
        id: `gen-lead-${property.id}-3`,
        customerName: "Vikramaditya S",
        phone: "+91 94441 55678",
        email: "vikram@enterprise.in",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocality: `${property.locality || "Anna Nagar"}, Chennai`,
        propertyPrice: formattedPrice,
        propertyImage: property.coverPhoto || property.images?.[0],
        requirement: property.purpose || "Rent",
        budget: formattedPrice,
        status: "contacted",
        timestamp: "2 days ago",
        preferredVisitDate: "Sunday, 11:30 AM",
        message: "Spoke over phone. Sent floorplan brochure on WhatsApp. Following up for visit.",
        visitData: null,
      },
    ];
  }, [leads, property]);

  // Tab-filtered leads
  const filteredLeads = useMemo(() => {
    if (activeTab === "All") return projectLeads;
    const normalizedTab = activeTab.toLowerCase().replace(" ", "_");
    return projectLeads.filter((l) => {
      if (activeTab === "Visit Scheduled") return l.status === "visit_scheduled";
      return l.status === normalizedTab;
    });
  }, [projectLeads, activeTab]);

  const handleCall = (lead) => {
    Alert.alert("Calling Customer", `Dialing ${lead.customerName} at ${lead.phone || "+91 98840 12345"}...`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => {} },
    ]);
  };

  const handleChat = (lead) => {
    Alert.alert(
      "WhatsApp & Message",
      `Opening direct conversation with ${lead.customerName} (${lead.phone}).`,
      [{ text: "OK" }]
    );
  };

  const formattedPrice = property
    ? property.priceFormatted ||
      (property.price
        ? `₹${property.price.toLocaleString("en-IN")}${property.priceUnit || ""}`
        : "Price On Request")
    : "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {property?.title || "Project Leads"}
          </Text>
          <Text style={styles.headerTitle}>Enquiries & Leads</Text>
        </View>

        <View style={styles.headerBadgeWrap}>
          <Text style={styles.headerBadgeText}>
            {projectLeads.length} {projectLeads.length === 1 ? "Lead" : "Leads"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO PROJECT SUMMARY CARD ================= */}
        {property && (
          <View style={styles.projectHeroCard}>
            <View style={styles.projectImageWrap}>
              <Image
                source={{
                  uri:
                    property.coverPhoto ||
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
                }}
                style={styles.projectImage}
                resizeMode="cover"
              />
              <View style={styles.projectStatusBadge}>
                <Text style={styles.projectStatusBadgeText}>
                  {(property.status || "ACTIVE").toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.projectDetails}>
              <Text style={styles.projectTitle} numberOfLines={1}>
                {property.title}
              </Text>
              <View style={styles.projectLocalityRow}>
                <MapPin size={12} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.projectLocality} numberOfLines={1}>
                  {property.locality || "Chennai"}, {property.city || "Tamil Nadu"}
                </Text>
              </View>

              <Text style={styles.projectPrice}>{formattedPrice}</Text>

              {/* Quick Metrics Strip */}
              <View style={styles.projectMetricsRow}>
                <View style={styles.metricItem}>
                  <Eye size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.metricText}>{property.views || "1.2K"} Views</Text>
                </View>
                <Text style={styles.metricDot}>•</Text>
                <View style={styles.metricItem}>
                  <MessageSquare size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.metricText, { color: COLORS.primary, fontWeight: "700" }]}>
                    {projectLeads.length} Enquiries
                  </Text>
                </View>
                <Text style={styles.metricDot}>•</Text>
                <View style={styles.metricItem}>
                  <Calendar size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.metricText}>{property.visits || 8} Visits</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ================= STATUS TABS FILTER ================= */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {LEAD_TABS.map((tab) => {
              const count =
                tab === "All"
                  ? projectLeads.length
                  : projectLeads.filter((l) => {
                      const normalizedTab = tab.toLowerCase().replace(" ", "_");
                      if (tab === "Visit Scheduled") return l.status === "visit_scheduled";
                      return l.status === normalizedTab;
                    }).length;
              const isActive = activeTab === tab;

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
                  <View
                    style={[
                      styles.tabCountBadge,
                      isActive && styles.tabCountBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabCountText,
                        isActive && styles.tabCountTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ================= LEADS LIST ================= */}
        {filteredLeads.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={activeTab === "All" ? "No Leads Yet" : `No ${activeTab} Leads`}
            description={
              activeTab === "All"
                ? "As soon as prospective buyers or tenants express interest in this listing, their enquiries will appear here."
                : `There are currently no leads categorized under "${activeTab}" for this property.`
            }
          />
        ) : (
          <View style={styles.leadsList}>
            {filteredLeads.map((lead) => {
              const isNew = lead.status === "new";
              const isVisitScheduled = lead.status === "visit_scheduled";

              return (
                <TouchableOpacity
                  key={lead.id}
                  style={styles.leadCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate("OwnerLeadDetail", { lead })}
                >
                  {/* Lead Header */}
                  <View style={styles.leadHeaderRow}>
                    <Image
                      source={{
                        uri:
                          lead.avatar ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                      }}
                      style={styles.leadAvatar}
                    />

                    <View style={styles.leadInfoCol}>
                      <View style={styles.leadNameRow}>
                        <Text style={styles.leadCustomerName} numberOfLines={1}>
                          {lead.customerName}
                        </Text>
                        <StatusBadge status={lead.status} />
                      </View>
                      <Text style={styles.leadBudgetSub} numberOfLines={1}>
                        {isNew ? "New Enquiry" : "Verified Customer"} • Budget:{" "}
                        <Text style={{ fontWeight: "700", color: "#0F172A" }}>
                          {lead.budget || formattedPrice}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  {/* Message Preview Quote */}
                  {lead.message ? (
                    <View style={styles.messageBox}>
                      <Text style={styles.messageText} numberOfLines={2}>
                        "{lead.message}"
                      </Text>
                    </View>
                  ) : null}

                  {/* Visit Scheduled Alert Chip */}
                  {isVisitScheduled && lead.visitData && (
                    <View style={styles.visitChipRow}>
                      <Calendar size={13} color="#D97706" style={{ marginRight: 5 }} />
                      <Text style={styles.visitChipText}>
                        Visit Booked: {lead.visitData.date}, {lead.visitData.time}
                      </Text>
                    </View>
                  )}

                  {/* Footer Action Bar */}
                  <View style={styles.leadFooterRow}>
                    <Text style={styles.leadTimestamp}>{lead.timestamp || "Today"}</Text>

                    <View style={styles.leadActionBtns}>
                      <TouchableOpacity
                        style={styles.actionCircleBtn}
                        onPress={() => handleChat(lead)}
                        activeOpacity={0.7}
                      >
                        <MessageSquare size={14} color="#475569" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionCircleBtnPrimary}
                        onPress={() => handleCall(lead)}
                        activeOpacity={0.7}
                      >
                        <Phone size={14} color={COLORS.primary} fill={COLORS.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.viewDetailsBtn}
                        onPress={() => navigation.navigate("OwnerLeadDetail", { lead })}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ChevronRight size={13} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Site Visit Modal */}
      {selectedLeadForVisit && (
        <OwnerSiteVisitModal
          visible={!!selectedLeadForVisit}
          lead={selectedLeadForVisit}
          onClose={() => setSelectedLeadForVisit(null)}
          onVisitScheduled={(leadId, visitDetails) => {
            scheduleVisit(leadId, visitDetails);
            setSelectedLeadForVisit(null);
          }}
        />
      )}

      {/* Close Lead Modal */}
      {selectedLeadForClose && (
        <OwnerCloseLeadModal
          visible={!!selectedLeadForClose}
          lead={selectedLeadForClose}
          onClose={() => setSelectedLeadForClose(null)}
          onLeadClosed={(leadId, reason) => {
            closeLead(leadId, reason);
            setSelectedLeadForClose(null);
          }}
        />
      )}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },

  /* TOP HEADER */
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    letterSpacing: -0.1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
    marginTop: 1,
  },
  headerBadgeWrap: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  /* HERO PROJECT SUMMARY CARD */
  projectHeroCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  projectImageWrap: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    marginRight: 14,
  },
  projectImage: {
    width: "100%",
    height: "100%",
  },
  projectStatusBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  projectStatusBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  projectDetails: {
    flex: 1,
    justifyContent: "center",
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  projectLocalityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  projectLocality: {
    fontSize: 12,
    color: "#64748B",
    flex: 1,
  },
  projectPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 4,
  },
  projectMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flexWrap: "wrap",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  metricDot: {
    fontSize: 10,
    color: "#CBD5E1",
    marginHorizontal: 5,
  },

  /* STATUS TABS */
  tabsContainer: {
    marginHorizontal: -20,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: "center",
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
    marginRight: 6,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  tabCountBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  tabCountBadgeActive: {
    backgroundColor: "#DBEAFE",
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    includeFontPadding: false,
  },
  tabCountTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  /* LEADS LIST */
  leadsList: {
    gap: 12,
  },
  leadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  leadHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: "#E2E8F0",
  },
  leadInfoCol: {
    flex: 1,
  },
  leadNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  leadCustomerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 8,
  },
  leadBudgetSub: {
    fontSize: 12,
    color: "#64748B",
  },
  messageBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  messageText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 17,
    fontStyle: "italic",
  },
  visitChipRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  visitChipText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#B45309",
  },
  leadFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  leadTimestamp: {
    fontSize: 11.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  leadActionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  actionCircleBtnPrimary: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  viewDetailsText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 2,
  },
});
