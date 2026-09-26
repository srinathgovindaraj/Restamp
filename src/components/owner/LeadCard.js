import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Phone, MessageSquare, Calendar, ChevronRight, Eye } from "lucide-react-native";
import COLORS from "../../constants/colors";
import StatusBadge from "./StatusBadge";

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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onViewDetails?.(lead)}
      activeOpacity={0.88}
    >
      {/* Top Header: Avatar, Name, Role & Action icons */}
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
            {isNew ? "New Enquiry" : "Verified Buyer"} • {lead.budget || "Budget: ₹1.2 Cr"}
          </Text>
        </View>

        {/* Action icons stack */}
        <View style={styles.actionIconsRow}>
          <TouchableOpacity
            style={styles.circleActionBtn}
            onPress={() => onChat?.(lead)}
            activeOpacity={0.75}
          >
            <MessageSquare size={15} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleActionBtn}
            onPress={() => onCall?.(lead)}
            activeOpacity={0.75}
          >
            <Phone size={15} color="#475569" />
          </TouchableOpacity>

          {onScheduleVisit && (
            <TouchableOpacity
              style={styles.circleActionBtn}
              onPress={() => onScheduleVisit?.(lead)}
              activeOpacity={0.75}
            >
              <Calendar size={15} color="#475569" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.circleActionBtnDark}
            onPress={() => onViewDetails?.(lead)}
            activeOpacity={0.75}
          >
            <ChevronRight size={15} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property & Enquiry Snippet Quote */}
      <View style={styles.snippetContainer}>
        <Text style={styles.snippetText} numberOfLines={2}>
          Interested in {lead.propertyTitle}
          {lead.propertyLocality ? ` • ${lead.propertyLocality}` : ""}
          {lead.requirement ? `. ${lead.requirement}` : ". Scheduled site visit enquiry."}
        </Text>
      </View>

      {/* Meta Footer: Timestamp and Status */}
      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color="#94A3B8" style={{ marginRight: 5 }} />
          <Text style={styles.metaText}>
            {lead.timestamp || "Today, 11:20 AM"}
          </Text>
        </View>

        <StatusBadge status={lead.status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    backgroundColor: "#E2E8F0",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.2,
  },
  customerRole: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "400",
  },
  actionIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  circleActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  circleActionBtnDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  snippetContainer: {
    marginBottom: 12,
  },
  snippetText: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
    fontWeight: "400",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "400",
  },
});
