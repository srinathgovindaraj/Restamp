import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
  TextInput,
  Alert,
  Platform,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Building2,
  Share2,
  Sparkles,
  ChevronRight,
  MoreVertical,
  X,
  Check,
  Bed,
  Maximize2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useAgent } from "../../context/AgentContext";
import PropertyDetailModal from "../../components/PropertyDetailModal";

export default function AgentLeadDetailScreen({ route, navigation }) {
  const { lead: initialLead } = route.params || {};
  const {
    leads,
    localityProperties,
    updateLeadStatus,
    scheduleVisit,
    closeDeal,
    selectedLocalities,
  } = useAgent();

  // Find updated lead from context
  const lead = leads.find((l) => l.id === initialLead?.id) || initialLead;

  // Modals state
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedPropertyForVisit, setSelectedPropertyForVisit] = useState(null);
  const [visitDate, setVisitDate] = useState("Tomorrow, 04:00 PM");
  const [visitNotes, setVisitNotes] = useState("");

  const [closureModalVisible, setClosureModalVisible] = useState(false);
  const [closureOutcome, setClosureOutcome] = useState("converted"); // converted | lost
  const [closureNotes, setClosureNotes] = useState("");

  const [activePropertyModal, setActivePropertyModal] = useState(null);

  // Filter matching properties strictly from Agent's assigned localities
  const matchingProperties = useMemo(() => {
    if (!lead) return [];
    const leadLoc = (lead.preferredLocality || "").toLowerCase();
    const leadBhkNum = parseInt(lead.bhk) || 0;

    return localityProperties.filter((item) => {
      const itemLoc = (item.location || "").toLowerCase();
      const itemAddr = (item.address || "").toLowerCase();
      // Must match preferred locality or same area
      const localityMatch = itemLoc.includes(leadLoc) || itemAddr.includes(leadLoc);
      return localityMatch;
    });
  }, [localityProperties, lead]);

  const handleCall = () => {
    const rawPhone = lead?.phone || "+919876543210";
    Linking.openURL(`tel:${rawPhone.replace(/[^0-9+]/g, "")}`).catch(() => {
      Alert.alert("Call", `Call ${lead?.customerName} at ${rawPhone}`);
    });
  };

  const handleWhatsApp = () => {
    const rawPhone = lead?.phone || "+919876543210";
    const text = encodeURIComponent(
      `Hello ${lead?.customerName}! I am your RESTAMP Certified Agent regarding your inquiry for ${lead?.requirement} in ${lead?.preferredLocality}. I have matching verified listings to share with you.`
    );
    Linking.openURL(`https://wa.me/${rawPhone.replace(/[^0-9]/g, "")}?text=${text}`).catch(() => {
      Alert.alert("WhatsApp", `Contact at ${rawPhone}`);
    });
  };

  const handleShareProperty = (property) => {
    const shareMessage = `🏠 RESTAMP Property Recommendation for ${lead.customerName}:\n\n*${property.title}*\n📍 Location: ${property.location}\n💰 Price: ${property.price}\n🛏 Beds: ${property.beds || 2} BHK • 📐 Area: ${property.sqft || 1200} sqft\n\nVerified Owner Listing. Let me know when you'd like to schedule a site visit!`;
    Share.share({
      message: shareMessage,
      title: property.title,
    });
  };

  const handleConfirmScheduleVisit = () => {
    if (!selectedPropertyForVisit && matchingProperties.length > 0) {
      setSelectedPropertyForVisit(matchingProperties[0]);
    }
    const prop = selectedPropertyForVisit || matchingProperties[0] || {
      id: "prop-default",
      title: lead.requirement,
      location: lead.preferredLocality,
    };

    scheduleVisit({
      leadId: lead.id,
      customerName: lead.customerName,
      customerPhone: lead.phone,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyLocation: prop.location,
      ownerName: prop.ownerName || "Property Owner",
      ownerPhone: prop.ownerPhone || "+91 98400 12345",
      date: "Upcoming Visit",
      fullDate: visitDate,
      time: visitDate.includes("PM") || visitDate.includes("AM") ? visitDate.split(", ")[1] : "04:30 PM",
      notes: visitNotes || "Site visit coordinated via RESTAMP Agent",
    });

    setScheduleModalVisible(false);
    Alert.alert(
      "Visit Scheduled! 📅",
      `Site visit with ${lead.customerName} for ${prop.title} has been scheduled for ${visitDate}. Owner notified via SMS/WhatsApp.`
    );
  };

  const handleConfirmClosure = () => {
    closeDeal(lead.id, closureOutcome, closureNotes);
    setClosureModalVisible(false);
    Alert.alert(
      closureOutcome === "converted" ? "Congratulations! 🎉" : "Status Updated",
      closureOutcome === "converted"
        ? `Deal marked as CONVERTED for ${lead.customerName}. Your commission and brokerage records are updated.`
        : `Lead marked as ${closureOutcome.toUpperCase()}.`
    );
  };

  if (!lead) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ padding: 20 }}>Lead not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Details</Text>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => setClosureModalVisible(true)}
          activeOpacity={0.7}
        >
          <MoreVertical size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CUSTOMER PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <Image source={{ uri: lead.avatar }} style={styles.customerAvatar} />
            <View style={styles.customerHeaderInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.customerNameTitle}>{lead.customerName}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
                    {lead.status.replace("_", " ").toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.customerPhoneText}>{lead.phone}</Text>
              <Text style={styles.customerEmailText}>{lead.email}</Text>
            </View>
          </View>

          {/* Quick Contact Buttons Row */}
          <View style={styles.contactActionsRow}>
            <TouchableOpacity style={styles.btnCall} onPress={handleCall} activeOpacity={0.8}>
              <Phone size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.btnCallText}>Call Client</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnWhatsApp} onPress={handleWhatsApp} activeOpacity={0.8}>
              <MessageSquare size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.btnWhatsAppText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSchedule}
              onPress={() => setScheduleModalVisible(true)}
              activeOpacity={0.8}
            >
              <Calendar size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.btnScheduleText}>Schedule Visit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CLIENT REQUIREMENT CARD */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Requirement Specification</Text>

          <View style={styles.specGrid}>
            <View style={styles.specField}>
              <Text style={styles.specLabel}>Requirement</Text>
              <Text style={styles.specVal}>{lead.requirement}</Text>
            </View>

            <View style={styles.specField}>
              <Text style={styles.specLabel}>Deal Type</Text>
              <Text style={styles.specVal}>{lead.dealType || "Rent / Buy"}</Text>
            </View>

            <View style={styles.specField}>
              <Text style={styles.specLabel}>Preferred Locality</Text>
              <Text style={[styles.specVal, { color: COLORS.primary, fontWeight: "700" }]}>
                {lead.preferredLocality}
              </Text>
            </View>

            <View style={styles.specField}>
              <Text style={styles.specLabel}>Budget Range</Text>
              <Text style={[styles.specVal, { fontWeight: "800", color: "#0F172A" }]}>
                {lead.budget}
              </Text>
            </View>

            <View style={styles.specField}>
              <Text style={styles.specLabel}>Bedrooms (BHK)</Text>
              <Text style={styles.specVal}>{lead.bhk || "2 BHK"}</Text>
            </View>

            <View style={styles.specField}>
              <Text style={styles.specLabel}>Move-In Date</Text>
              <Text style={styles.specVal}>{lead.moveInDate || "Immediate"}</Text>
            </View>
          </View>

          {lead.message && (
            <View style={styles.messageBox}>
              <Text style={styles.messageLabel}>Client Note / Message:</Text>
              <Text style={styles.messageContent}>"{lead.message}"</Text>
            </View>
          )}
        </View>

        {/* STAGE & NEGOTIATION WORKFLOW CARD */}
        <View style={styles.card}>
          <View style={styles.workflowHeader}>
            <Text style={styles.cardSectionTitle}>Lead Pipeline Stage</Text>
            <TouchableOpacity onPress={() => setClosureModalVisible(true)}>
              <Text style={styles.linkText}>Update Outcome</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stageTabsRow}>
            {["contacted", "qualified", "visit_scheduled", "negotiating", "converted"].map((st) => {
              const isCurrent = lead.status === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.stageChip, isCurrent && styles.stageChipCurrent]}
                  onPress={() => updateLeadStatus(lead.id, st)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.stageChipText, isCurrent && styles.stageChipTextCurrent]}>
                    {st.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECTION: SUGGESTED MATCHING PROPERTIES */}
        <View style={styles.matchingSection}>
          <View style={styles.matchingHeaderRow}>
            <View>
              <Text style={styles.cardSectionTitle}>Suggested Matching Properties</Text>
              <Text style={styles.matchingSubtitle}>
                Owner-posted properties in {lead.preferredLocality}
              </Text>
            </View>
            <View style={styles.matchBadge}>
              <Sparkles size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.matchBadgeText}>{matchingProperties.length} Matches</Text>
            </View>
          </View>

          {matchingProperties.length === 0 ? (
            <View style={styles.emptyMatches}>
              <Building2 size={32} color="#CBD5E1" />
              <Text style={styles.emptyMatchesText}>
                No current listings in {lead.preferredLocality}.
              </Text>
            </View>
          ) : (
            <View style={styles.matchingList}>
              {matchingProperties.map((prop) => (
                <View key={prop.id} style={styles.matchPropCard}>
                  <TouchableOpacity
                    onPress={() => setActivePropertyModal(prop)}
                    style={styles.matchPropTop}
                  >
                    <Image source={{ uri: prop.image }} style={styles.matchPropImage} />
                    <View style={styles.matchPropInfo}>
                      <Text style={styles.matchPropTitle} numberOfLines={1}>
                        {prop.title}
                      </Text>
                      <Text style={styles.matchPropLoc} numberOfLines={1}>
                        {prop.location}
                      </Text>
                      <Text style={styles.matchPropPrice}>{prop.price}</Text>
                      <Text style={styles.matchPropSpecs}>
                        {prop.beds || 2} BHK • {prop.sqft || 1200} sqft • Owner Listed
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Actions: View Property | Share Property | Schedule Visit */}
                  <View style={styles.matchPropActions}>
                    <TouchableOpacity
                      style={styles.btnPropAction}
                      onPress={() => setActivePropertyModal(prop)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnPropActionText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnPropActionSecondary}
                      onPress={() => handleShareProperty(prop)}
                      activeOpacity={0.8}
                    >
                      <Share2 size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.btnPropActionSecondaryText}>Share Property</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnPropActionPrimary}
                      onPress={() => {
                        setSelectedPropertyForVisit(prop);
                        setScheduleModalVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Calendar size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.btnPropActionPrimaryText}>Schedule Visit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* SCHEDULE VISIT MODAL */}
      <Modal
        visible={scheduleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Schedule Site Visit</Text>
                <Text style={styles.modalSub}>Client: {lead.customerName}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setScheduleModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Date & Time Slot</Text>
              <View style={styles.slotPillsRow}>
                {["Tomorrow, 11:00 AM", "Tomorrow, 04:30 PM", "Saturday, 10:30 AM", "Sunday, 04:00 PM"].map(
                  (slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.slotPill, visitDate === slot && styles.slotPillActive]}
                      onPress={() => setVisitDate(slot)}
                    >
                      <Text style={[styles.slotPillText, visitDate === slot && styles.slotPillTextActive]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text style={styles.fieldLabel}>Custom Date / Time</Text>
              <TextInput
                style={styles.textInput}
                value={visitDate}
                onChangeText={setVisitDate}
                placeholder="e.g. Sat, 04 Oct 2026, 4:30 PM"
                underlineColorAndroid="transparent"
              />

              <Text style={styles.fieldLabel}>Owner Coordination Notes</Text>
              <TextInput
                style={[styles.textInput, { height: 60 }]}
                value={visitNotes}
                onChangeText={setVisitNotes}
                placeholder="e.g. Owner will meet client at entrance, keys ready."
                underlineColorAndroid="transparent"
                multiline
              />

              <View style={styles.ownerNoticeBox}>
                <ShieldCheck size={16} color="#16A34A" style={{ marginRight: 6 }} />
                <Text style={styles.ownerNoticeText}>
                  Owner will automatically receive confirmation SMS with client details.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleConfirmScheduleVisit}
              activeOpacity={0.88}
            >
              <Text style={styles.modalSubmitBtnText}>Confirm & Schedule Visit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DEAL OUTCOME / CLOSURE MODAL */}
      <Modal
        visible={closureModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClosureModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Deal Outcome</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setClosureModalVisible(false)}
              >
                <X size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <View style={styles.outcomeRow}>
              <TouchableOpacity
                style={[styles.outcomeBtn, closureOutcome === "converted" && styles.outcomeBtnConverted]}
                onPress={() => setClosureOutcome("converted")}
              >
                <Text style={[styles.outcomeBtnText, closureOutcome === "converted" && styles.outcomeBtnTextConverted]}>
                  ✓ Converted (Won)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outcomeBtn, closureOutcome === "lost" && styles.outcomeBtnLost]}
                onPress={() => setClosureOutcome("lost")}
              >
                <Text style={[styles.outcomeBtnText, closureOutcome === "lost" && styles.outcomeBtnTextLost]}>
                  ✕ Lost (Closed)
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Closing Notes & Agreement Terms</Text>
            <TextInput
              style={[styles.textInput, { height: 70 }]}
              value={closureNotes}
              onChangeText={setClosureNotes}
              placeholder="e.g. Token ₹50,000 paid. Rental agreement executed at ₹25,000/mo."
              underlineColorAndroid="transparent"
              multiline
            />

            <TouchableOpacity
              style={[
                styles.modalSubmitBtn,
                closureOutcome === "lost" && { backgroundColor: "#64748B" },
              ]}
              onPress={handleConfirmClosure}
              activeOpacity={0.88}
            >
              <Text style={styles.modalSubmitBtnText}>
                {closureOutcome === "converted" ? "Mark Deal Converted" : "Mark Lead Lost"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FULL PROPERTY PREVIEW MODAL */}
      <PropertyDetailModal
        property={activePropertyModal}
        visible={!!activePropertyModal}
        onClose={() => setActivePropertyModal(null)}
      />
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
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    gap: 14,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  customerHeaderInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customerNameTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statusPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
  },
  customerPhoneText: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
    fontWeight: "600",
  },
  customerEmailText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  contactActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  btnCall: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    borderRadius: 100,
    paddingVertical: 10,
  },
  btnCallText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnWhatsApp: {
    flex: 1.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    borderRadius: 100,
    paddingVertical: 10,
  },
  btnWhatsAppText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnSchedule: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 100,
    paddingVertical: 10,
  },
  btnScheduleText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  specField: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
  },
  specLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  specVal: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "600",
    marginTop: 2,
  },
  messageBox: {
    marginTop: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  messageLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
    fontStyle: "italic",
  },
  workflowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  linkText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  stageTabsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  stageChip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stageChipCurrent: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  stageChipText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  stageChipTextCurrent: {
    color: "#2563EB",
    fontWeight: "700",
  },
  matchingSection: {
    marginTop: 4,
  },
  matchingHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  matchingSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptyMatches: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMatchesText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
  },
  matchingList: {
    gap: 12,
  },
  matchPropCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  matchPropTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  matchPropImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  matchPropInfo: {
    flex: 1,
  },
  matchPropTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  matchPropLoc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  matchPropPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 2,
  },
  matchPropSpecs: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  matchPropActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  btnPropAction: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 7,
    borderRadius: 100,
    alignItems: "center",
  },
  btnPropActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
  },
  btnPropActionSecondary: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 7,
    borderRadius: 100,
  },
  btnPropActionSecondaryText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  btnPropActionPrimary: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    borderRadius: 100,
  },
  btnPropActionPrimaryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSub: {
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
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    marginTop: 8,
  },
  slotPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  slotPill: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  slotPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
  },
  slotPillText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  slotPillTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: "#0F172A",
    marginBottom: 8,
    outlineStyle: "none",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  ownerNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    marginVertical: 10,
  },
  ownerNoticeText: {
    fontSize: 11,
    color: "#166534",
    flex: 1,
  },
  modalSubmitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  outcomeRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  outcomeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  outcomeBtnConverted: {
    backgroundColor: "#F0FDF4",
    borderColor: "#16A34A",
  },
  outcomeBtnLost: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
  },
  outcomeBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  outcomeBtnTextConverted: {
    color: "#16A34A",
  },
  outcomeBtnTextLost: {
    color: "#DC2626",
  },
});
