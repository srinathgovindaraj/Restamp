import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  X,
  User,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useAgent } from "../../context/AgentContext";
import AppBrandHeader from "../../components/AppBrandHeader";

const VISIT_TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function AgentVisitsScreen({ navigation }) {
  const { visits, updateVisitStatus, scheduleVisit } = useAgent();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Reschedule / Action modal state
  const [selectedVisitForAction, setSelectedVisitForAction] = useState(null);

  const filteredVisits = useMemo(() => {
    return visits.filter((v) => v.status === activeTab);
  }, [visits, activeTab]);

  const handleCall = (phone, name) => {
    const raw = phone || "+919876543210";
    Linking.openURL(`tel:${raw.replace(/[^0-9+]/g, "")}`).catch(() => {
      Alert.alert("Call", `Call ${name} at ${raw}`);
    });
  };

  const handleWhatsApp = (phone, name, visit) => {
    const raw = phone || "+919876543210";
    const text = encodeURIComponent(
      `Hello ${name}! Regarding the scheduled site visit for ${visit.propertyTitle} on ${visit.date} at ${visit.time}. Please let me know if you need directions or have any questions.`
    );
    Linking.openURL(`https://wa.me/${raw.replace(/[^0-9]/g, "")}?text=${text}`).catch(() => {
      Alert.alert("WhatsApp", `Contact ${name} at ${raw}`);
    });
  };

  const handleMarkCompleted = (visitId) => {
    updateVisitStatus(visitId, "completed");
    setSelectedVisitForAction(null);
    Alert.alert("Visit Completed! ✅", "Site visit status marked as completed. You can now follow up for negotiation.");
  };

  const handleCancelVisit = (visitId) => {
    updateVisitStatus(visitId, "cancelled");
    setSelectedVisitForAction(null);
    Alert.alert("Visit Cancelled", "The visit has been marked as cancelled.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP BRAND HEADER (Matching Buyer Page) */}
      <AppBrandHeader currentRole="agent" />

      {/* Screen Title */}
      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.headerTitle}>Site Visits & Inspections</Text>
          <Text style={styles.headerSubtitle}>
            Coordinated buyer & owner inspections
          </Text>
        </View>

        <View style={styles.activeBadge}>
          <Calendar size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.activeBadgeText}>
            {visits.filter((v) => v.status === "upcoming").length} Upcoming
          </Text>
        </View>
      </View>

      {/* TABS (Upcoming, Completed, Cancelled) */}
      <View style={styles.tabsRow}>
        {VISIT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = visits.filter((v) => v.status === tab.id).length;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* VISITS LIST */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVisits.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={38} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No {activeTab} visits</Text>
            <Text style={styles.emptySub}>
              {activeTab === "upcoming"
                ? "Schedule visits directly from any client lead page."
                : `Visits marked as ${activeTab} will appear here.`}
            </Text>
          </View>
        ) : (
          <View style={styles.visitsList}>
            {filteredVisits.map((item) => (
              <View key={item.id} style={styles.visitCard}>
                {/* Top Card Row: Date/Time Badge & Status */}
                <View style={styles.cardHeader}>
                  <View style={styles.timeBadge}>
                    <Clock size={13} color={COLORS.primary} style={{ marginRight: 5 }} />
                    <Text style={styles.timeBadgeText}>
                      {item.date} • {item.time}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      item.status === "completed" && styles.statusPillCompleted,
                      item.status === "cancelled" && styles.statusPillCancelled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        item.status === "completed" && styles.statusPillTextCompleted,
                        item.status === "cancelled" && styles.statusPillTextCancelled,
                      ]}
                    >
                      {item.status === "upcoming"
                        ? "VISIT SCHEDULED"
                        : item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Property Details Block */}
                <View style={styles.propertyInfoBlock}>
                  <Text style={styles.propertyTitle}>{item.propertyTitle}</Text>
                  <View style={styles.locationRow}>
                    <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.locationText}>{item.propertyLocation}</Text>
                  </View>
                </View>

                {/* Customer & Owner Info Grid */}
                <View style={styles.partiesGrid}>
                  {/* Client Party */}
                  <View style={styles.partyBox}>
                    <View style={styles.partyHeader}>
                      <User size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.partyRoleLabel}>Client / Buyer</Text>
                    </View>
                    <Text style={styles.partyName}>{item.customerName}</Text>
                    <View style={styles.partyActionsRow}>
                      <TouchableOpacity
                        style={styles.partyMiniBtn}
                        onPress={() => handleWhatsApp(item.customerPhone, item.customerName, item)}
                      >
                        <MessageSquare size={13} color="#16A34A" />
                        <Text style={[styles.partyMiniBtnText, { color: "#16A34A" }]}>WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.partyMiniBtn}
                        onPress={() => handleCall(item.customerPhone, item.customerName)}
                      >
                        <Phone size={13} color="#0F172A" />
                        <Text style={styles.partyMiniBtnText}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Owner Party */}
                  <View style={styles.partyBox}>
                    <View style={styles.partyHeader}>
                      <Building2 size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.partyRoleLabel}>Property Owner</Text>
                    </View>
                    <Text style={styles.partyName}>{item.ownerName || "Property Owner"}</Text>
                    <View style={styles.partyActionsRow}>
                      <TouchableOpacity
                        style={styles.partyMiniBtn}
                        onPress={() => handleWhatsApp(item.ownerPhone, item.ownerName, item)}
                      >
                        <MessageSquare size={13} color="#16A34A" />
                        <Text style={[styles.partyMiniBtnText, { color: "#16A34A" }]}>WhatsApp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.partyMiniBtn}
                        onPress={() => handleCall(item.ownerPhone, item.ownerName)}
                      >
                        <Phone size={13} color="#0F172A" />
                        <Text style={styles.partyMiniBtnText}>Call</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Notes if available */}
                {item.notes && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>Note: {item.notes}</Text>
                  </View>
                )}

                {/* Bottom Action Buttons for Visit */}
                {item.status === "upcoming" && (
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.btnActionSecondary}
                      onPress={() => setSelectedVisitForAction(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnActionSecondaryText}>Manage Visit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnActionPrimary}
                      onPress={() => handleMarkCompleted(item.id)}
                      activeOpacity={0.88}
                    >
                      <CheckCircle2 size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                      <Text style={styles.btnActionPrimaryText}>Mark Completed</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* MANAGE VISIT ACTION MODAL */}
      <Modal
        visible={!!selectedVisitForAction}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedVisitForAction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Visit</Text>
              <TouchableOpacity onPress={() => setSelectedVisitForAction(null)}>
                <X size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              {selectedVisitForAction?.customerName} • {selectedVisitForAction?.propertyTitle}
            </Text>

            <View style={styles.modalOptionsList}>
              <TouchableOpacity
                style={styles.modalOptionItem}
                onPress={() => handleMarkCompleted(selectedVisitForAction?.id)}
              >
                <CheckCircle2 size={18} color="#16A34A" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>Mark as Completed</Text>
                  <Text style={styles.modalOptionSub}>Site inspection done with client</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptionItem}
                onPress={() => handleCancelVisit(selectedVisitForAction?.id)}
              >
                <XCircle size={18} color="#DC2626" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalOptionTitle, { color: "#DC2626" }]}>Cancel Visit</Text>
                  <Text style={styles.modalOptionSub}>Client or owner cancelled inspection</Text>
                </View>
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
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
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
  visitsList: {
    gap: 14,
  },
  visitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statusPill: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillCompleted: {
    backgroundColor: "#F0FDF4",
  },
  statusPillCancelled: {
    backgroundColor: "#FEF2F2",
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#EA580C",
  },
  statusPillTextCompleted: {
    color: "#16A34A",
  },
  statusPillTextCancelled: {
    color: "#DC2626",
  },
  propertyInfoBlock: {
    marginBottom: 12,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    color: "#64748B",
  },
  partiesGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  partyBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  partyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  partyRoleLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  partyName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  partyActionsRow: {
    flexDirection: "row",
    gap: 6,
  },
  partyMiniBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 3,
  },
  partyMiniBtnText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0F172A",
  },
  notesBox: {
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  notesText: {
    fontSize: 11,
    color: "#64748B",
    fontStyle: "italic",
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  btnActionSecondary: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 9,
    borderRadius: 100,
    alignItems: "center",
  },
  btnActionSecondaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  btnActionPrimary: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    paddingVertical: 9,
    borderRadius: 100,
  },
  btnActionPrimaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    marginBottom: 14,
  },
  modalOptionsList: {
    gap: 10,
  },
  modalOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalOptionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalOptionSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
});
