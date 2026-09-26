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
          <ArrowLeft size={20} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Details</Text>
        <StatusBadge status={lead.status} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Header Card */}
        <View style={styles.customerCard}>
          <Image
            source={{
              uri:
                lead.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{lead.customerName}</Text>
            <Text style={styles.customerPhone}>{lead.phone}</Text>
            <Text style={styles.customerEmail}>{lead.email}</Text>
          </View>
        </View>

        {/* Quick Contact Actions Row */}
        <View style={styles.contactActionsRow}>
          <TouchableOpacity
            style={[styles.contactActionBtn, { backgroundColor: COLORS.primary }]}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Phone size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.contactActionBtnText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactActionBtn, { backgroundColor: "#10B981" }]}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <MessageCircle size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.contactActionBtnText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* LEAD STATUS STEPPER (Section 10 requirement) */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Update Lead Pipeline Status</Text>
          <Text style={styles.cardSub}>
            Tap a stage to update this lead's progress in your conversion pipeline:
          </Text>

          <View style={styles.statusStepper}>
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
                    isPast && styles.stepperItemPast,
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
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <Text
                        style={[
                          styles.stepperDotNum,
                          isCurrent && { color: "#FFFFFF" },
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
                    ]}
                    numberOfLines={1}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
            <View style={{ flex: 1 }}>
              <Text style={styles.propertyMiniTitle} numberOfLines={1}>
                {lead.propertyTitle}
              </Text>
              <View style={styles.locRow}>
                <MapPin size={12} color={COLORS.textSecondary} style={{ marginRight: 3 }} />
                <Text style={styles.propertyMiniLoc}>{lead.propertyLocality}</Text>
              </View>
              <Text style={styles.propertyMiniPrice}>{lead.propertyPrice}</Text>
            </View>
          </View>
        </View>

        {/* Requirement & Budget Specifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Inquiry Specifications</Text>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Requirement</Text>
            <View style={styles.reqPill}>
              <Text style={styles.reqText}>{lead.requirement}</Text>
            </View>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Budget</Text>
            <Text style={styles.specVal}>{lead.budget}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Preferred Visit Date</Text>
            <Text style={styles.specVal}>{lead.preferredVisitDate || "Flexible"}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Received</Text>
            <Text style={styles.specVal}>{lead.timestamp}</Text>
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
          <View style={[styles.sectionCard, { borderColor: "#DDD6FE", backgroundColor: "#FAF5FF" }]}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Calendar size={18} color="#7C3AED" style={{ marginRight: 8 }} />
              <Text style={[styles.cardHeading, { color: "#6D28D9", marginBottom: 0 }]}>
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
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 18,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    backgroundColor: "#F1F5F9",
  },
  customerName: {
    fontSize: 17,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  customerPhone: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  customerEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
    fontWeight: "400",
  },
  contactActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  contactActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactActionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
    fontWeight: "400",
  },
  statusStepper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepperItem: {
    alignItems: "center",
    width: 50,
  },
  stepperItemActive: {},
  stepperItemPast: {},
  stepperDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepperDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepperDotPast: {
    backgroundColor: COLORS.success,
  },
  stepperDotNum: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  stepperLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: "400",
    textAlign: "center",
  },
  stepperLabelActive: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  propertyMiniCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    marginTop: 4,
  },
  propertyMiniThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  propertyMiniTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  propertyMiniLoc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  propertyMiniPrice: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.primary,
    marginTop: 4,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  specLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  specVal: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  reqPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reqText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.primary,
  },
  messageBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 18,
    fontStyle: "italic",
    fontWeight: "400",
  },
  visitDataText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6D28D9",
    marginBottom: 2,
  },
  visitNoteText: {
    fontSize: 12,
    color: "#7C3AED",
    fontWeight: "400",
  },
  bottomActions: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
