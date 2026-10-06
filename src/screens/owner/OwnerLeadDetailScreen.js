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
        {/* ================= 1. CUSTOMER PROFILE HERO (BORDERLESS) ================= */}
        <View style={styles.customerHeroSection}>
          <View style={styles.customerTopRow}>
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

            <View style={styles.customerInfoCol}>
              <Text style={styles.customerName}>{lead.customerName}</Text>
              
              <TouchableOpacity
                style={styles.customerMetaRow}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Phone size={13} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.customerPhone}>{lead.phone}</Text>
              </TouchableOpacity>

              {lead.email ? (
                <View style={styles.customerMetaRow}>
                  <Mail size={13} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={styles.customerEmail}>{lead.email}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Quick Contact Buttons Row */}
          <View style={styles.contactActionsRow}>
            <TouchableOpacity
              style={[styles.contactActionBtn, styles.callActionBtn]}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Phone size={15} color={COLORS.primary} fill={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.callActionBtnText}>Call Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactActionBtn, styles.whatsappActionBtn]}
              onPress={handleWhatsApp}
              activeOpacity={0.8}
            >
              <MessageCircle size={16} color="#16A34A" style={{ marginRight: 8 }} />
              <Text style={styles.whatsappActionBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* ================= 2. PIPELINE STATUS (BORDERLESS TRACK) ================= */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Pipeline Status</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a stage to update this lead's conversion progress:
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
                    styles.stepperPill,
                    isCurrent && styles.stepperPillActive,
                    isPast && styles.stepperPillPast,
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

        <View style={styles.sectionDivider} />

        {/* ================= 3. PROPERTY INTERESTED IN (FULL PROPERTY BANNER) ================= */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Property Interested In</Text>

          <View style={styles.propertyBanner}>
            <Image
              source={{
                uri:
                  lead.propertyImage ||
                  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
              }}
              style={styles.propertyBannerImage}
              resizeMode="cover"
            />
            <View style={styles.propertyBannerBadge}>
              <Text style={styles.propertyBannerBadgeText}>
                {(lead.requirement || "FOR RENT").toUpperCase()}
              </Text>
            </View>

            <View style={styles.propertyBannerContent}>
              <Text style={styles.propertyBannerTitle} numberOfLines={1}>
                {lead.propertyTitle}
              </Text>
              
              <View style={styles.propertyBannerLocRow}>
                <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                <Text style={styles.propertyBannerLoc} numberOfLines={1}>
                  {lead.propertyLocality || "Chennai"}
                </Text>
              </View>

              <Text style={styles.propertyBannerPrice}>
                {lead.propertyPrice}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* ================= 4. INQUIRY SPECIFICATIONS (CLEAN SPEC LIST) ================= */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Inquiry Specifications</Text>

          <View style={styles.specList}>
            <View style={styles.specRowItem}>
              <View style={styles.specLabelCol}>
                <Building size={15} color="#64748B" style={{ marginRight: 8 }} />
                <Text style={styles.specLabelText}>Requirement</Text>
              </View>
              <View style={styles.specPillHighlight}>
                <Text style={styles.specPillHighlightText}>
                  {lead.requirement || "Residential"}
                </Text>
              </View>
            </View>

            <View style={styles.specRowItem}>
              <View style={styles.specLabelCol}>
                <Clock size={15} color="#64748B" style={{ marginRight: 8 }} />
                <Text style={styles.specLabelText}>Budget</Text>
              </View>
              <Text style={styles.specValueHighlight}>
                {lead.budget}
              </Text>
            </View>

            <View style={styles.specRowItem}>
              <View style={styles.specLabelCol}>
                <Calendar size={15} color="#64748B" style={{ marginRight: 8 }} />
                <Text style={styles.specLabelText}>Preferred Visit</Text>
              </View>
              <Text style={styles.specValueRegular}>
                {lead.preferredVisitDate || "Flexible"}
              </Text>
            </View>

            <View style={[styles.specRowItem, { borderBottomWidth: 0 }]}>
              <View style={styles.specLabelCol}>
                <CheckCircle2 size={15} color="#64748B" style={{ marginRight: 8 }} />
                <Text style={styles.specLabelText}>Received Date</Text>
              </View>
              <Text style={styles.specValueRegular}>
                {lead.timestamp}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* ================= 5. CUSTOMER MESSAGE ================= */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Customer Message</Text>
          <View style={styles.messageBlockQuote}>
            <Text style={styles.messageBlockQuoteText}>
              "{lead.message || "Customer expressed interest and requested callback."}"
            </Text>
          </View>
        </View>

        {/* ================= 6. SCHEDULED SITE VISIT (IF EXISTS) ================= */}
        {lead.visitData && (
          <>
            <View style={styles.sectionDivider} />
            <View style={styles.sectionBlock}>
              <View style={styles.scheduledVisitBanner}>
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
            </View>
          </>
        )}

        <View style={styles.sectionDivider} />

        {/* ================= 7. BOTTOM ACTION BUTTONS ================= */}
        <View style={styles.actionsFooter}>
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
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* 1. CUSTOMER HERO SECTION */
  customerHeroSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  customerTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#EFF6FF",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  customerInfoCol: {
    flex: 1,
    justifyContent: "center",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  customerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  customerPhone: {
    fontSize: 13.5,
    color: COLORS.primary,
    fontWeight: "600",
  },
  customerEmail: {
    fontSize: 12.5,
    color: "#64748B",
  },
  contactActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  contactActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  callActionBtn: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  callActionBtnText: {
    color: COLORS.primary,
    fontSize: 13.5,
    fontWeight: "700",
  },
  whatsappActionBtn: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  whatsappActionBtnText: {
    color: "#16A34A",
    fontSize: 13.5,
    fontWeight: "700",
  },

  /* SECTION DIVIDERS & BLOCKS */
  sectionDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
  },
  sectionBlock: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 14,
    lineHeight: 17,
  },

  /* 2. PIPELINE STATUS TRACK */
  statusStepperScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  stepperPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  stepperPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
  },
  stepperPillPast: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  stepperDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  stepperDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepperDotPast: {
    backgroundColor: "#10B981",
  },
  stepperDotNum: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#64748B",
  },
  stepperDotNumActive: {
    color: "#FFFFFF",
  },
  stepperLabel: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  stepperLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  stepperLabelPast: {
    color: "#166534",
    fontWeight: "600",
  },

  /* 3. PROPERTY BANNER */
  propertyBanner: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginTop: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  propertyBannerImage: {
    width: "100%",
    height: 145,
  },
  propertyBannerBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#0F172A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  propertyBannerBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  propertyBannerContent: {
    padding: 14,
    backgroundColor: "#FFFFFF",
  },
  propertyBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  propertyBannerLocRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  propertyBannerLoc: {
    fontSize: 12.5,
    color: "#64748B",
  },
  propertyBannerPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
  },

  /* 4. INQUIRY SPEC LIST */
  specList: {
    marginTop: 6,
  },
  specRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  specLabelCol: {
    flexDirection: "row",
    alignItems: "center",
  },
  specLabelText: {
    fontSize: 13.5,
    color: "#475569",
    fontWeight: "500",
  },
  specPillHighlight: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specPillHighlightText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.primary,
  },
  specValueHighlight: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  specValueRegular: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#334155",
  },

  /* 5. CUSTOMER MESSAGE */
  messageBlockQuote: {
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  messageBlockQuoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    fontStyle: "italic",
  },

  /* 6. SCHEDULED SITE VISIT */
  scheduledVisitBanner: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    padding: 16,
  },
  scheduledVisitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
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
    marginBottom: 2,
  },
  visitNoteText: {
    fontSize: 12.5,
    color: "#2563EB",
    lineHeight: 18,
  },

  /* 7. ACTIONS FOOTER */
  actionsFooter: {
    paddingHorizontal: 20,
    paddingTop: 18,
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
