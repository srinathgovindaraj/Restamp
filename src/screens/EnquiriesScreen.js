import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const MOCK_ENQUIRIES = [
  {
    id: "enq-1",
    agentName: "Sarah Jenkins",
    agency: "Premier Luxe Realty",
    propertyTitle: "Palm Crest Villa",
    lastMessage: "Hi! The site visit for Palm Crest Villa is scheduled for tomorrow at 3:00 PM.",
    time: "10:30 AM",
    unread: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    status: "Site Visit Confirmed",
  },
  {
    id: "enq-2",
    agentName: "Michael Chang",
    agency: "Skyline Properties",
    propertyTitle: "Skyline Horizon Apartment",
    lastMessage: "The owner is willing to negotiate the token amount. Let me know if you want to make an offer.",
    time: "Yesterday",
    unread: false,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    status: "Negotiation",
  },
  {
    id: "enq-3",
    agentName: "Elena Rostova",
    agency: "Hamptons Premier Realty",
    propertyTitle: "The Haven Luxury Villa",
    lastMessage: "I sent you the floor plan and video walkthrough over email.",
    time: "2 days ago",
    unread: false,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    status: "Information Sent",
  },
];

export default function EnquiriesScreen() {
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enquiries & Messages</Text>
        <Text style={styles.headerSubtitle}>Connect directly with property owners and agents</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "Active" && styles.tabBtnActive]}
          onPress={() => setActiveTab("Active")}
        >
          <Text style={[styles.tabText, activeTab === "Active" && styles.tabTextActive]}>
            Active Enquiries ({MOCK_ENQUIRIES.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "Closed" && styles.tabBtnActive]}
          onPress={() => setActiveTab("Closed")}
        >
          <Text style={[styles.tabText, activeTab === "Closed" && styles.tabTextActive]}>
            Closed
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
        {MOCK_ENQUIRIES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.enquiryCard} activeOpacity={0.85}>
            <Image source={{ uri: item.avatar }} style={styles.agentAvatar} />

            <View style={styles.enquiryBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.agentName}>{item.agentName}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              <Text style={styles.agencyText}>{item.agency}</Text>

              <View style={styles.propertyTag}>
                <Ionicons name="business-outline" size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.propertyTitleText} numberOfLines={1}>
                  {item.propertyTitle}
                </Text>
              </View>

              <Text style={styles.lastMessage} numberOfLines={2}>
                {item.lastMessage}
              </Text>

              <View style={styles.statusRow}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <TouchableOpacity style={styles.chatActionBtn}>
                  <Ionicons name="chatbubble-ellipses-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.chatActionText}>Chat Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#F1F5F9",
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 20,
  },
  enquiryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  enquiryBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agentName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  agencyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  propertyTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  propertyTitleText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  lastMessage: {
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 18,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  chatActionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
