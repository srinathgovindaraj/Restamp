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
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Check,
  Building,
  User,
  ExternalLink,
  Mail,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import StatusBadge from "../../components/owner/StatusBadge";
import PrimaryButton from "../../components/owner/PrimaryButton";
import SecondaryButton from "../../components/owner/SecondaryButton";
import OwnerSiteVisitModal from "./OwnerSiteVisitModal";
import OwnerCloseLeadModal from "./OwnerCloseLeadModal";

const STATUS_STEPS = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "visit_scheduled", label: "Visit Scheduled" },
  { id: "visited", label: "Visited" },
  { id: "negotiating", label: "Negotiating" },
  { id: "closed", label: "Closed" },
];

export default function OwnerLeadDetailScreen({ route, navigation }) {
  const { updateLeadStatus, scheduleVisit, closeLead } = useOwner();
  const initialLead = route?.params?.lead;

  const [lead, setLead] = useState(initialLead);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  if (!lead) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text>Lead details not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: COLORS.primary, marginTop: 10 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdateStatus = (newStatus) => {
    if (newStatus === "closed") {
      setShowCloseModal(true);
      return;
    }
    if (newStatus === "visit_scheduled") {
      setShowVisitModal(true);
      return;
    }
    updateLeadStatus(lead.id, newStatus);
    setLead((prev) => ({ ...prev, status: newStatus }));
  };

  const handleCall = () => {
    Alert.alert("Calling Customer", `Connecting call to ${lead.customerName} (${lead.phone})...`);
    if (lead.status === "new") {
      handleUpdateStatus("contacted");
    }
  };

  const handleWhatsApp = () => {
    Alert.alert("WhatsApp Chat", `Opening WhatsApp chat with ${lead.customerName} (${lead.phone}).`);
    if (lead.status === "new") {
      handleUpdateStatus("contacted");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Lead Details</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {lead.customerName}
          </Text>
        </View>
        <StatusBadge status={lead.status} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Header Card */}
        <View style={styles.customerCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  lead.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
              }}
              style={styles.avatar}
            />
            <View style={styles.verifiedDot}>
              <Check size={10} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>

          <View style={styles.customerDetailsCol}>
            <Text style={styles.customerName}>{lead.customerName}</Text>
            
            <TouchableOpacity
              style={styles.customerPhoneRow}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Phone size={13} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.customerPhone}>{lead.phone}</Text>
            </TouchableOpacity>

            {lead.email ? (
              <View style={styles.customerEmailRow}>
                <Mail size={13} color="#64748B" style={{ marginRight: 6 }} />
                <Text style={styles.customerEmail}>{lead.email}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Quick Contact Actions Row */}
        <View style={styles.contactActionsRow}>
          <TouchableOpacity
            style={[styles.contactActionBtn, styles.callActionBtn]}
            onPress={handleCall}
            activeOpacity={0.85}
          >
            <Phone size={16} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.contactActionBtnText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactActionBtn, styles.whatsappActionBtn]}
            onPress={handleWhatsApp}
            activeOpacity={0.85}
          >
            <MessageCircle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.contactActionBtnText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* LEAD STATUS STEPPER (Pipeline Status) */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Pipeline Status</Text>
          <Text style={styles.cardSub}>
            Tap a stage to update this lead's progress in your conversion pipeline:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusStepperScroll}
          >
            {STATUS_STEPS.map((s, idx) => {
              const isCurrent = lead.status === s.id;
              const isPast =
                STATUS_STEPS.findIndex((x) => x.id === lead.status) > idx;

              return (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.stepperItem,
                    isCurrent && styles.stepperItemActive,
                  ]}
                  onPress={() => handleUpdateStatus(s.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.stepperDot,
                      isCurrent && styles.stepperDotActive,
                      isPast && styles.stepperDotPast,
                    ]}
                  >
                    {isPast ? (
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <Text
                        style={[
                          styles.stepperDotNum,
                          isCurrent && styles.stepperDotNumActive,
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepperLabel,
                      isCurrent && styles.stepperLabelActive,
                      isPast && styles.stepperLabelPast,
                    ]}
                    numberOfLines={1}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Property Mini-Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Property Interested In</Text>
          <View style={styles.propertyMiniCard}>
            <Image
              source={{
                uri:
                  lead.propertyImage ||
                  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80",
              }}
              style={styles.propertyMiniThumb}
            />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.propertyMiniTitle} numberOfLines={1}>
                {lead.propertyTitle}
              </Text>
              <View style={styles.locRow}>
                <MapPin size={12} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.propertyMiniLoc} numberOfLines={1}>
                  {lead.propertyLocality}
                </Text>
              </View>
              <Text style={styles.propertyMiniPrice}>{lead.propertyPrice}</Text>
            </View>
          </View>
        </View>

        {/* Requirement & Budget Specifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Inquiry Specifications</Text>

          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Requirement</Text>
              <View style={styles.reqPill}>
                <Text style={styles.reqText}>{lead.requirement || "Residential"}</Text>
              </View>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Budget</Text>
              <Text style={styles.specBoxVal} numberOfLines={1}>{lead.budget}</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Preferred Visit</Text>
              <Text style={styles.specBoxVal} numberOfLines={1}>{lead.preferredVisitDate || "Flexible"}</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specBoxLabel}>Received</Text>
              <Text style={styles.specBoxVal} numberOfLines={1}>{lead.timestamp}</Text>
            </View>
          </View>
        </View>

        {/* Customer Message */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Customer Message</Text>
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              "{lead.message || "Customer expressed interest and requested callback."}"
            </Text>
          </View>
        </View>

        {/* Site Visit Info if scheduled */}
        {lead.visitData && (
          <View style={styles.scheduledVisitCard}>
            <View style={styles.scheduledVisitHeader}>
              <Calendar size={18} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.scheduledVisitTitle}>
                Scheduled Site Visit
              </Text>
            </View>
            <Text style={styles.visitDataText}>
              Date: {lead.visitData.date} at {lead.visitData.time}
            </Text>
            {lead.visitData.note && (
              <Text style={styles.visitNoteText}>Note: {lead.visitData.note}</Text>
            )}
          </View>
        )}

        {/* Action Buttons: Schedule Visit / Close Deal */}
        <View style={styles.bottomActions}>
          <PrimaryButton
            title="Schedule Site Visit"
            onPress={() => setShowVisitModal(true)}
            icon={Calendar}
            style={{ width: "100%", marginBottom: 12 }}
          />

          <SecondaryButton
            title="Close Lead / Mark Outcome"
            onPress={() => setShowCloseModal(true)}
            variant="outline"
            style={{ width: "100%" }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Schedule Visit Modal */}
      <OwnerSiteVisitModal
        visible={showVisitModal}
        lead={lead}
        onClose={() => setShowVisitModal(false)}
        onVisitScheduled={(leadId, visitData) => {
          scheduleVisit(leadId, visitData);
          setLead((prev) => ({
            ...prev,
            status: "visit_scheduled",
            visitData,
          }));
        }}
      />

      {/* Close Lead Modal */}
      <OwnerCloseLeadModal
        visible={showCloseModal}
        lead={lead}
        onClose={() => setShowCloseModal(false)}
        onCloseLeadWithOutcome={(leadId, outcome, closeProp, propId) => {
          closeLead(leadId, outcome, closeProp, propId);
          setLead((prev) => ({
            ...prev,
            status: "closed",
            closedOutcome: outcome,
          }));
        }}
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
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
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
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 16,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    padding: 18,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#EFF6FF",
  },
  verifiedDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  customerDetailsCol: {
    flex: 1,
    justifyContent: "center",
  },
  customerName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  customerPhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  customerPhone: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  customerEmailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  customerEmail: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
  },
  contactActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  contactActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  callActionBtn: {
    backgroundColor: COLORS.primary,
  },
  whatsappActionBtn: {
    backgroundColor: "#16A34A",
  },
  contactActionBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardSub: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 17,
  },
  statusStepperScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 12,
  },
  stepperItem: {
    alignItems: "center",
    minWidth: 64,
  },
  stepperItemActive: {},
  stepperDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepperDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  stepperDotPast: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  stepperDotNum: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  stepperDotNumActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  stepperLabel: {
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
  },
  stepperLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  stepperLabelPast: {
    color: "#0F172A",
    fontWeight: "500",
  },
  propertyMiniCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    padding: 12,
    marginTop: 4,
  },
  propertyMiniThumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#E2E8F0",
  },
  propertyMiniTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  propertyMiniLoc: {
    fontSize: 12,
    color: "#64748B",
    flex: 1,
  },
  propertyMiniPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 5,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  specBox: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    padding: 12,
    justifyContent: "center",
  },
  specBoxLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  specBoxVal: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  reqPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  reqText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  messageBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  messageText: {
    fontSize: 13.5,
    color: "#334155",
    lineHeight: 20,
    fontStyle: "italic",
    fontWeight: "400",
  },
  scheduledVisitCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 16,
    marginBottom: 14,
  },
  scheduledVisitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scheduledVisitTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
  },
  visitDataText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 3,
  },
  visitNoteText: {
    fontSize: 12.5,
    color: "#2563EB",
    lineHeight: 18,
  },
  bottomActions: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
