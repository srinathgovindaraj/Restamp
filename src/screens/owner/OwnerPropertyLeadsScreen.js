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
  TextInput,
  Share,
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
  SlidersHorizontal,
  X,
  MoreVertical,
  Share2,
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Tab and search filtered leads
  const filteredLeads = useMemo(() => {
    let list = projectLeads;
    if (activeTab !== "All") {
      const normalizedTab = activeTab.toLowerCase().replace(" ", "_");
      list = list.filter((l) => {
        if (activeTab === "Visit Scheduled") return l.status === "visit_scheduled";
        return l.status === normalizedTab;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.customerName?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.message?.toLowerCase().includes(q) ||
          l.requirement?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projectLeads, activeTab, searchQuery]);

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

  const handleShare = async (lead) => {
    try {
      await Share.share({
        title: `Enquiry from ${lead.customerName}`,
        message: `Property Lead Enquiry:\nCustomer: ${lead.customerName}\nPhone: ${lead.phone || "+91 98840 12345"}\nProperty: ${property?.title || "Property"}\nBudget: ${lead.budget || formattedPrice}\nNote: "${lead.message || "Interested in listing"}"`,
      });
    } catch (error) {
      console.log("Error sharing lead:", error);
    }
  };

  const handleMoreOptions = (lead) => {
    Alert.alert(
      lead.customerName,
      `Status: ${(lead.status || "NEW").toUpperCase()}\nPhone: ${lead.phone || "+91 98840 12345"}\nBudget: ${lead.budget || formattedPrice}`,
      [
        {
          text: "Schedule Visit",
          onPress: () => setSelectedLeadForVisit(lead),
        },
        {
          text: "Call Customer",
          onPress: () => handleCall(lead),
        },
        {
          text: "WhatsApp / Chat",
          onPress: () => handleChat(lead),
        },
        {
          text: "View Full Details",
          onPress: () => navigation.navigate("OwnerLeadDetail", { lead }),
        },
        {
          text: "Close Lead",
          style: "destructive",
          onPress: () => setSelectedLeadForClose(lead),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
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

        {/* Search Input Bar (Expandable) */}
        {showSearch && (
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarCard}>
              <Search size={16} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search leads by customer name, phone..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
                  <X size={16} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ================= STATUS TABS FILTER (Buyer Search Properties Filter Bar Design) ================= */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {/* Main Filter Icon Button */}
            <TouchableOpacity
              style={[styles.filterIconPill, showSearch && styles.filterIconPillActive]}
              activeOpacity={0.8}
              onPress={() => setShowSearch(!showSearch)}
            >
              <SlidersHorizontal size={15} color={showSearch ? COLORS.primary : "#334155"} />
            </TouchableOpacity>

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
                  style={[styles.filterDropdownPill, isActive && styles.filterDropdownPillActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterDropdownText, isActive && styles.filterDropdownTextActive]}>
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
                  activeOpacity={0.92}
                  onPress={() => navigation.navigate("OwnerLeadDetail", { lead })}
                >
                  {/* Header Row: Avatar, Name + Subtitle (Author • Friday 3:12 PM), 3-Dots Menu */}
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
                      <Text style={styles.leadCustomerName} numberOfLines={1}>
                        {lead.customerName}
                      </Text>
                      <Text style={styles.leadSubtitle} numberOfLines={1}>
                        {isNew
                          ? "New Enquiry"
                          : isVisitScheduled
                          ? "Visit Scheduled"
                          : lead.status === "contacted"
                          ? "Contacted"
                          : "Verified Buyer"}{" "}
                        • {lead.timestamp || "Today • 10:35 AM"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.moreOptionsBtn}
                      onPress={() => handleMoreOptions(lead)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      activeOpacity={0.7}
                    >
                      <MoreVertical size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  {/* Body Content: Clean natural text */}
                  <Text style={styles.leadBodyText}>
                    {lead.message ||
                      `Interested in ${property?.title || "this property"}. Looking for ${lead.requirement || "Rent"}. Please schedule a site visit.`}
                  </Text>

                  {/* Hashtags Row: #rent #budget #locality #status matching reference */}
                  <View style={styles.leadTagsRow}>
                    <Text style={styles.leadTag}>
                      #{lead.requirement ? lead.requirement.replace(/\s+/g, "") : "Rent"}
                    </Text>
                    <Text style={styles.leadTag}>
                      #{lead.budget ? lead.budget.replace(/[^a-zA-Z0-9]/g, "") : "Budget"}
                    </Text>
                    <Text style={styles.leadTag}>
                      #{property?.locality ? property.locality.replace(/[^a-zA-Z0-9]/g, "") : "Chennai"}
                    </Text>
                    <Text style={[styles.leadTag, { color: COLORS.primary }]}>
                      #{lead.status ? lead.status.replace(/_/g, "") : "Enquiry"}
                    </Text>
                  </View>

                  {/* Visit Scheduled Alert Chip (if applicable) */}
                  {isVisitScheduled && lead.visitData && (
                    <View style={styles.visitChipRow}>
                      <Calendar size={13} color="#D97706" style={{ marginRight: 6 }} />
                      <Text style={styles.visitChipText}>
                        Visit Booked: {lead.visitData.date}, {lead.visitData.time}
                      </Text>
                    </View>
                  )}

                  {/* Footer Action Row: [ Phone/Call ]  [ Chat ]  ...  [ Share ] */}
                  <View style={styles.leadFooterRow}>
                    <View style={styles.footerLeftActions}>
                      <TouchableOpacity
                        style={styles.footerActionBtn}
                        onPress={() => handleCall(lead)}
                        activeOpacity={0.7}
                      >
                        <Phone size={17} color="#64748B" />
                        <Text style={styles.footerActionText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.footerActionBtn}
                        onPress={() => handleChat(lead)}
                        activeOpacity={0.7}
                      >
                        <MessageSquare size={17} color="#64748B" />
                        <Text style={styles.footerActionText}>Chat</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.footerShareBtn}
                      onPress={() => handleShare(lead)}
                      activeOpacity={0.7}
                    >
                      <Share2 size={17} color="#64748B" />
                      <Text style={styles.footerShareText}>Share</Text>
                    </TouchableOpacity>
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

  /* SEARCH BAR */
  searchBarWrapper: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  searchBarCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: "#0F172A",
  },

  /* STATUS TABS (BUYER SEARCH FILTER DESIGN) */
  tabsContainer: {
    marginHorizontal: -20,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  tabsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterIconPill: {
    width: 36,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  filterIconPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EFF6FF",
  },
  filterDropdownPill: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  filterDropdownPillActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EFF6FF",
  },
  filterDropdownText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  filterDropdownTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  tabCountBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
  },
  tabCountBadgeActive: {
    backgroundColor: "#DBEAFE",
  },
  tabCountText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
    includeFontPadding: false,
  },
  tabCountTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },

  /* LEADS LIST (MATCHING REFERENCE SOCIAL POST CARD DESIGN) */
  leadsList: {
    gap: 14,
  },
  leadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  leadHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  leadAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
  },
  leadInfoCol: {
    flex: 1,
    justifyContent: "center",
  },
  leadCustomerName: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  leadSubtitle: {
    fontSize: 12.5,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },
  moreOptionsBtn: {
    padding: 6,
    marginRight: -4,
  },
  leadBodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#334155",
    marginTop: 12,
    marginBottom: 8,
  },
  leadTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  leadTag: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
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
    marginTop: 4,
    marginBottom: 6,
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
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerLeftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  footerActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  footerActionText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  footerShareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  footerShareText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
});
