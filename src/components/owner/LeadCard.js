import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Alert } from "react-native";
import { Phone, MessageSquare, Calendar, ChevronRight, MoreVertical, Share2 } from "lucide-react-native";
import COLORS from "../../constants/colors";

export default function LeadCard({
  lead,
  onViewDetails,
  onCall,
  onChat,
  onScheduleVisit,
  compact = false,
}) {
  const isNew = lead.status === "new";
  const isVisitScheduled = lead.status === "visit_scheduled";

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Enquiry from ${lead.customerName}`,
        message: `Property Lead Enquiry:\nCustomer: ${lead.customerName}\nPhone: ${lead.phone || "N/A"}\nProperty: ${lead.propertyTitle || "Listing"}\nBudget: ${lead.budget || "N/A"}\nNote: "${lead.message || "Interested in listing"}"`,
      });
    } catch (err) {
      console.log("Error sharing lead:", err);
    }
  };

  const handleMore = () => {
    Alert.alert(
      lead.customerName,
      `Status: ${(lead.status || "NEW").toUpperCase()}\nPhone: ${lead.phone || "+91 98840 12345"}\nBudget: ${lead.budget || "N/A"}`,
      [
        { text: "Schedule Visit", onPress: () => onScheduleVisit?.(lead) },
        { text: "Call Customer", onPress: () => onCall?.(lead) },
        { text: "WhatsApp / Chat", onPress: () => onChat?.(lead) },
        { text: "View Details", onPress: () => onViewDetails?.(lead) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewDetails?.(lead)}
      activeOpacity={0.92}
    >
      {/* Header Row: Avatar, Name + Subtitle (Author • Friday 3:12 PM), 3-Dots */}
      <View style={styles.topRow}>
        <Image
          source={{
            uri:
              lead.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          }}
          style={styles.avatar}
        />

        <View style={styles.customerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>
            {lead.customerName}
          </Text>
          <Text style={styles.customerRole} numberOfLines={1}>
            {isNew
              ? "New Enquiry"
              : isVisitScheduled
              ? "Visit Scheduled"
              : "Verified Buyer"}{" "}
            • {lead.timestamp || "Today • 11:20 AM"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.moreBtn}
          onPress={handleMore}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <MoreVertical size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Body Text */}
      <Text style={styles.bodyText}>
        {lead.message ||
          `Interested in ${lead.propertyTitle || "your property"}${
            lead.propertyLocality ? ` in ${lead.propertyLocality}` : ""
          }. ${lead.requirement || "Looking for property in this locality."}`}
      </Text>

      {/* Hashtags Row */}
      <View style={styles.tagsRow}>
        <Text style={styles.tag}>
          #{lead.requirement ? lead.requirement.replace(/\s+/g, "") : "Rent"}
        </Text>
        {lead.budget && (
          <Text style={styles.tag}>
            #{lead.budget.replace(/[^a-zA-Z0-9]/g, "") || "Budget"}
          </Text>
        )}
        {lead.propertyLocality && (
          <Text style={styles.tag}>
            #{lead.propertyLocality.replace(/[^a-zA-Z0-9]/g, "")}
          </Text>
        )}
        {lead.status && (
          <Text style={[styles.tag, { color: COLORS.primary }]}>
            #{lead.status.replace(/_/g, "")}
          </Text>
        )}
      </View>

      {/* Visit Booked Chip (if applicable) */}
      {isVisitScheduled && lead.visitData && (
        <View style={styles.visitChip}>
          <Calendar size={13} color="#D97706" style={{ marginRight: 6 }} />
          <Text style={styles.visitChipText}>
            Visit Booked: {lead.visitData.date}, {lead.visitData.time}
          </Text>
        </View>
      )}

      {/* Footer Row: [ Phone/Call ]  [ Chat ]  ...  [ Share ] */}
      <View style={styles.footerRow}>
        <View style={styles.footerLeftActions}>
          <TouchableOpacity
            style={styles.footerActionBtn}
            onPress={() => onCall?.(lead)}
            activeOpacity={0.7}
          >
            <Phone size={17} color="#64748B" />
            <Text style={styles.footerActionText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerActionBtn}
            onPress={() => onChat?.(lead)}
            activeOpacity={0.7}
          >
            <MessageSquare size={17} color="#64748B" />
            <Text style={styles.footerActionText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.footerShareBtn}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={17} color="#64748B" />
          <Text style={styles.footerShareText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
  },
  customerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  customerName: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  customerRole: {
    fontSize: 12.5,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "500",
  },
  moreBtn: {
    padding: 6,
    marginRight: -4,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#334155",
    marginTop: 12,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  tag: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  visitChip: {
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
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    marginTop: 10,
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
