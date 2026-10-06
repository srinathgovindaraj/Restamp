import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  Users,
  Phone,
  MessageSquare,
  Calendar,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Plus,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useAgent } from "../../context/AgentContext";
import AppBrandHeader from "../../components/AppBrandHeader";

const LEAD_TABS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "visit_scheduled", label: "Visit Scheduled" },
  { id: "visited", label: "Visited" },
  { id: "negotiating", label: "Negotiating" },
  { id: "converted", label: "Converted" },
  { id: "lost", label: "Lost" },
];

export default function AgentLeadsScreen({ navigation }) {
  const { leads, updateLeadStatus } = useAgent();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Summary counts
  const countNew = leads.filter((l) => l.status === "new").length;
  const countQualified = leads.filter((l) => l.status === "qualified").length;
  const countVisits = leads.filter((l) => l.status === "visit_scheduled" || l.status === "visited").length;
  const countNegotiating = leads.filter((l) => l.status === "negotiating").length;
  const countClosed = leads.filter((l) => l.status === "converted").length;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Tab filter
      if (activeTab !== "all" && lead.status !== activeTab) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = lead.customerName.toLowerCase().includes(q);
        const reqMatch = lead.requirement.toLowerCase().includes(q);
        const locMatch = lead.preferredLocality.toLowerCase().includes(q);
        if (!nameMatch && !reqMatch && !locMatch) return false;
      }
      return true;
    });
  }, [leads, activeTab, searchQuery]);

  const handleLeadPress = (lead) => {
    navigation.navigate("AgentLeadDetail", { lead });
  };

  const handleCall = (lead) => {
    const rawPhone = lead.phone || "+919876543210";
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Call Lead", `${lead.customerName}: ${rawPhone}`);
    });
  };

  const handleWhatsApp = (lead) => {
    const rawPhone = lead.phone || "+919876543210";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${lead.customerName}! I am Vikram Prabhu from RESTAMP regarding your requirement for ${lead.requirement} in ${lead.preferredLocality}. I have verified owner listings matching your budget.`
    );
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${text}`).catch(() => {
      Alert.alert("WhatsApp Unavailable", `Contact ${lead.customerName} at ${rawPhone}`);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP BRAND HEADER (Matching Buyer Page) */}
      <AppBrandHeader currentRole="agent" />

      {/* Screen Title */}
      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.headerTitle}>Client Inquiries & Leads</Text>
          <Text style={styles.headerSubtitle}>
            Verified buyer & tenant leads for your localities
          </Text>
        </View>

        <View style={styles.leadsTotalBadge}>
          <Text style={styles.leadsTotalText}>{leads.length} Total Leads</Text>
        </View>
      </View>

      {/* SUMMARY BADGES ROW */}
      <View style={styles.summaryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryScroll}
        >
          <View style={styles.statChip}>
            <Text style={styles.statChipNumber}>{countNew}</Text>
            <Text style={styles.statChipLabel}>New</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statChipNumber}>{countQualified}</Text>
            <Text style={styles.statChipLabel}>Qualified</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statChipNumber}>{countVisits}</Text>
            <Text style={styles.statChipLabel}>Visits</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statChipNumber}>{countNegotiating}</Text>
            <Text style={styles.statChipLabel}>Negotiating</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" }]}>
            <Text style={[styles.statChipNumber, { color: "#16A34A" }]}>{countClosed}</Text>
            <Text style={[styles.statChipLabel, { color: "#166534" }]}>Closed</Text>
          </View>
        </ScrollView>
      </View>

      {/* SEARCH AND STAGE TABS */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads by name, locality, or type..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColorAndroid="transparent"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {LEAD_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LEADS LIST */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={38} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No leads in this stage</Text>
            <Text style={styles.emptySub}>
              Leads will appear here as buyers submit inquiries in your assigned locations.
            </Text>
          </View>
        ) : (
          <View style={styles.leadsList}>
            {filteredLeads.map((lead) => {
              const isNew = lead.status === "new";
              const isVisit = lead.status === "visit_scheduled";
              const isConverted = lead.status === "converted";

              return (
                <TouchableOpacity
                  key={lead.id}
                  style={styles.leadCard}
                  onPress={() => handleLeadPress(lead)}
                  activeOpacity={0.88}
                >
                  {/* Top: Avatar, Name, Phone & WhatsApp */}
                  <View style={styles.cardTopRow}>
                    <Image source={{ uri: lead.avatar }} style={styles.avatar} />

                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>{lead.customerName}</Text>
                      <Text style={styles.customerTime}>{lead.timestamp}</Text>
                    </View>

                    {/* Quick Call & WhatsApp CTA buttons */}
                    <View style={styles.quickActions}>
                      <TouchableOpacity
                        style={styles.actionCircleBtn}
                        onPress={() => handleWhatsApp(lead)}
                        activeOpacity={0.75}
                      >
                        <MessageSquare size={15} color="#16A34A" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionCircleBtn}
                        onPress={() => handleCall(lead)}
                        activeOpacity={0.75}
                      >
                        <Phone size={15} color="#0F172A" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionCircleBtnDark}
                        onPress={() => handleLeadPress(lead)}
                        activeOpacity={0.75}
                      >
                        <ChevronRight size={15} color="#FFFFFF" strokeWidth={2.4} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Middle Snippet Requirement */}
                  <View style={styles.requirementBox}>
                    <View style={styles.reqLine}>
                      <Text style={styles.reqLabel}>Requirement:</Text>
                      <Text style={styles.reqValue} numberOfLines={1}>
                        {lead.requirement} ({lead.dealType})
                      </Text>
                    </View>

                    <View style={styles.reqLine}>
                      <Text style={styles.reqLabel}>Location:</Text>
                      <Text style={styles.reqValue} numberOfLines={1}>
                        {lead.preferredLocality}
                      </Text>
                    </View>

                    <View style={styles.reqLine}>
                      <Text style={styles.reqLabel}>Budget:</Text>
                      <Text style={[styles.reqValue, { fontWeight: "700", color: COLORS.primary }]}>
                        {lead.budget}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom: Status Badge + CTA */}
                  <View style={styles.cardFooter}>
                    <View
                      style={[
                        styles.statusPill,
                        isNew && styles.statusPillNew,
                        isVisit && styles.statusPillVisit,
                        isConverted && styles.statusPillConverted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          isNew && styles.statusPillTextNew,
                          isVisit && styles.statusPillTextVisit,
                          isConverted && styles.statusPillTextConverted,
                        ]}
                      >
                        {lead.status.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.viewLeadBtn}
                      onPress={() => handleLeadPress(lead)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewLeadBtnText}>View Lead</Text>
                      <ChevronRight size={13} color={COLORS.primary} strokeWidth={2.4} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  leadsTotalBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  leadsTotalText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  summaryBar: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
    paddingVertical: 10,
  },
  summaryScroll: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  statChipNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  statChipLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  searchSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    outlineStyle: "none",
    outlineWidth: 0,
  },
  tabsScroll: {
    flexDirection: "row",
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 240,
  },
  leadsList: {
    gap: 12,
  },
  leadCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  customerTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  quickActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  actionCircleBtnDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  requirementBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    gap: 4,
    marginBottom: 10,
  },
  reqLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  reqLabel: {
    width: 90,
    fontSize: 12,
    color: "#64748B",
  },
  reqValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillNew: {
    backgroundColor: "#EFF6FF",
  },
  statusPillVisit: {
    backgroundColor: "#FFF7ED",
  },
  statusPillConverted: {
    backgroundColor: "#F0FDF4",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
  },
  statusPillTextNew: {
    color: COLORS.primary,
  },
  statusPillTextVisit: {
    color: "#EA580C",
  },
  statusPillTextConverted: {
    color: "#16A34A",
  },
  viewLeadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  viewLeadBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
