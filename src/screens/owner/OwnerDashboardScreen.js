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
  Search,
  Menu,
  MoreHorizontal,
  ArrowUpRight,
  Plus,
  MessageSquare,
  Phone,
  Calendar,
  Eye,
  Building2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react-native";

import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import RestampLogo from "../../components/RestampLogo";

export default function OwnerDashboardScreen({ navigation }) {
  const { properties, leads, subscription, ownerProfile } = useOwner();

  // Calculate summary counts
  const activeCount = properties.filter((p) => p.status === "active").length;
  const pendingCount = properties.filter((p) => p.status === "pending").length;
  const closedCount = properties.filter((p) => p.status === "closed").length;

  // Aggregate performance stats
  const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalEnquiries = properties.reduce((acc, p) => acc + (p.enquiries || 0), 0);
  const totalVisits = properties.reduce((acc, p) => acc + (p.visits || 0), 0);

  // Latest leads
  const recentLeads = leads.slice(0, 3);

  const handleAddProperty = () => {
    navigation.navigate("Add");
  };

  const handleMyProperties = (tab = "Active") => {
    navigation.navigate("Properties", { initialTab: tab });
  };

  const handleViewLeads = () => {
    navigation.navigate("Leads");
  };

  const handleManagePlan = () => {
    navigation.navigate("OwnerPlans");
  };

  const handleSwitchToBuyer = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER: 4-Dot Brand Icon | Subtitle & Greeting | Search & Menu Icons */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          {/* Restamp Brand Logo matching Buyer Screen */}
          <View style={styles.brandIconWrapper}>
            <RestampLogo size={32} />
          </View>

          <View style={styles.headerTitles}>
            <Text style={styles.headerSubtitle}>RESTAMP Owner Studio</Text>
            <Text style={styles.headerGreeting}>
              Hey, {ownerProfile?.firstName || "Raj"} {ownerProfile?.lastName || "Kumar"}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() => navigation.navigate("Properties")}
            activeOpacity={0.7}
          >
            <Search size={20} color="#111111" strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() =>
              Alert.alert(
                "Owner Options",
                "Choose an action:",
                [
                  { text: "Switch to Buyer Mode", onPress: handleSwitchToBuyer },
                  { text: "Manage Subscription", onPress: handleManagePlan },
                  { text: "Cancel", style: "cancel" },
                ]
              )
            }
            activeOpacity={0.7}
          >
            <Menu size={22} color="#111111" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Switch Mode Pill Banner */}
        <TouchableOpacity
          style={styles.switchBanner}
          onPress={handleSwitchToBuyer}
          activeOpacity={0.8}
        >
          <View style={styles.switchBannerLeft}>
            <ArrowLeft size={15} color="#111111" strokeWidth={2.4} style={{ marginRight: 8 }} />
            <Text style={styles.switchBannerTitle}>Back to Buyer App</Text>
          </View>
          <View style={styles.switchBannerBadge}>
            <Text style={styles.switchBannerBadgeText}>Switch Mode</Text>
          </View>
        </TouchableOpacity>

        {/* CONTAINER 1: PROPERTY & LISTING ACTIVITY (Matches screenshot's big white card with 6 stat tiles) */}
        <View style={styles.bigCard}>
          <View style={styles.bigCardHeader}>
            <Text style={styles.bigCardTitle}>Property & Listing Activity</Text>
            <TouchableOpacity
              style={styles.moreIconBtn}
              onPress={() => handleMyProperties("Active")}
              activeOpacity={0.7}
            >
              <MoreHorizontal size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* 2-Column Grid of 6 Stat Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              {/* Tile 1: Active Listings */}
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => handleMyProperties("Active")}
                activeOpacity={0.8}
              >
                <View style={styles.statTileTop}>
                  <Text style={styles.statTileNumber}>
                    {String(activeCount).padStart(2, "0")}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                  </View>
                </View>
                <Text style={styles.statTileLabel}>Active Listings</Text>
              </TouchableOpacity>

              {/* Tile 2: Pending Generations / Review */}
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => handleMyProperties("Pending")}
                activeOpacity={0.8}
              >
                <View style={styles.statTileTop}>
                  <Text style={styles.statTileNumber}>
                    {String(pendingCount).padStart(2, "0")}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                  </View>
                </View>
                <Text style={styles.statTileLabel}>Pending Verification</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              {/* Tile 3: Total Enquiries */}
              <TouchableOpacity
                style={styles.statTile}
                onPress={handleViewLeads}
                activeOpacity={0.8}
              >
                <View style={styles.statTileTop}>
                  <Text style={styles.statTileNumber}>
                    {String(totalEnquiries || 14)}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                  </View>
                </View>
                <Text style={styles.statTileLabel}>Total Inquiries</Text>
              </TouchableOpacity>

              {/* Tile 4: Total Views */}
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => handleMyProperties("Active")}
                activeOpacity={0.8}
              >
                <View style={styles.statTileTop}>
                  <Text style={styles.statTileNumber}>
                    {totalViews > 0 ? totalViews.toLocaleString("en-IN") : "1,240"}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                  </View>
                </View>
                <Text style={styles.statTileLabel}>Property Views</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              {/* Tile 5: Site Visits */}
              <TouchableOpacity
                style={styles.statTile}
                onPress={handleViewLeads}
                activeOpacity={0.8}
              >
                <View style={styles.statTileTop}>
                  <Text style={styles.statTileNumber}>
                    {String(totalVisits || 6)}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                  </View>
                </View>
                <Text style={styles.statTileLabel}>Site Visits Booked</Text>
              </TouchableOpacity>

              {/* Tile 6: Closed Deals */}
              <TouchableOpacity
                style={styles.statTile}
                onPress={() => handleMyProperties("Closed")}
                activeOpacity={0.8}
              >
                <View style={styles.statTileTop}>
                  <Text style={styles.statTileNumber}>
                    {String(closedCount).padStart(2, "0")}
                  </Text>
                  <View style={styles.arrowCircle}>
                    <ArrowUpRight size={13} color="#111111" strokeWidth={2.4} />
                  </View>
                </View>
                <Text style={styles.statTileLabel}>Closed Listings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CONTAINER 2: RECENT BUYER LEADS (Matches screenshot's "Top Creators" card) */}
        <View style={styles.bigCard}>
          <View style={styles.bigCardHeader}>
            <Text style={styles.bigCardTitle}>Recent Buyer Leads</Text>
            <View style={styles.cardHeaderActions}>
              <TouchableOpacity
                style={styles.moreIconBtn}
                onPress={handleViewLeads}
                activeOpacity={0.7}
              >
                <MoreHorizontal size={18} color="#64748B" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blackAddBtn}
                onPress={handleAddProperty}
                activeOpacity={0.85}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.8} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Leads List formatted in the modern card system */}
          <View style={styles.leadsListContainer}>
            {recentLeads.map((lead, idx) => (
              <TouchableOpacity
                key={lead.id || idx}
                style={styles.creatorLeadCard}
                onPress={() => navigation.navigate("OwnerLeadDetail", { lead })}
                activeOpacity={0.85}
              >
                {/* Lead Header: Avatar, Name, Role & Action icons */}
                <View style={styles.creatorTopRow}>
                  <Image
                    source={{
                      uri:
                        lead.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                    }}
                    style={styles.creatorAvatar}
                  />

                  <View style={styles.creatorInfo}>
                    <Text style={styles.creatorName}>{lead.customerName}</Text>
                    <Text style={styles.creatorRole}>
                      {lead.status === "new" ? "New Enquiry" : "Verified Buyer"} • {lead.budget || "Budget: ₹1.2 Cr"}
                    </Text>
                  </View>

                  <View style={styles.creatorActions}>
                    <TouchableOpacity
                      style={styles.miniActionBtn}
                      onPress={() => Alert.alert("Chat", `Opening message with ${lead.customerName}`)}
                    >
                      <MessageSquare size={15} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.miniActionBtn}
                      onPress={() => Alert.alert("Call", `Dialing ${lead.phone || "+91 98765 43210"}`)}
                    >
                      <Phone size={15} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.miniActionBtn}
                      onPress={() => navigation.navigate("OwnerLeadDetail", { lead })}
                    >
                      <MoreHorizontal size={15} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Lead Snippet / Content Quote */}
                <Text style={styles.creatorSnippet} numberOfLines={2}>
                  Interested in {lead.propertyTitle} in {lead.propertyLocality || "Prime Location"}. Scheduled site visit enquiry.
                </Text>

                {/* Meta Footer: Date & Stat */}
                <View style={styles.creatorFooter}>
                  <View style={styles.creatorMetaItem}>
                    <Calendar size={13} color="#94A3B8" style={{ marginRight: 5 }} />
                    <Text style={styles.creatorMetaText}>
                      Received {lead.timestamp || "Today, 11:20 AM"}
                    </Text>
                  </View>

                  <View style={styles.creatorMetaItem}>
                    <Eye size={13} color="#94A3B8" style={{ marginRight: 5 }} />
                    <Text style={styles.creatorMetaText}>
                      {lead.status === "visit_scheduled" ? "Visit Scheduled" : "Direct Enquiry"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CONTAINER 3: ACTIVE SUBSCRIPTION & QUICK ACTIONS */}
        <View style={styles.bigCard}>
          <View style={styles.bigCardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ShieldCheck size={18} color="#16A34A" style={{ marginRight: 8 }} />
              <Text style={styles.bigCardTitle}>Owner Subscription</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>Active</Text>
            </View>
          </View>

          <View style={styles.subscriptionBox}>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subKey}>Current Plan</Text>
              <Text style={styles.subVal}>{subscription?.planName || "Owner Pro Plan"}</Text>
            </View>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subKey}>Validity</Text>
              <Text style={styles.subVal}>{subscription?.validity || "3 Months (90 Days)"}</Text>
            </View>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subKey}>Active Listing Limit</Text>
              <Text style={styles.subVal}>Up to {subscription?.listingLimit || 5} Properties</Text>
            </View>
          </View>

          {/* Quick CTA Actions */}
          <View style={styles.actionsStack}>
            <TouchableOpacity
              style={styles.primaryPillBtn}
              onPress={handleAddProperty}
              activeOpacity={0.88}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 8 }} />
              <Text style={styles.primaryPillBtnText}>+ Add New Property</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryPillBtn}
              onPress={handleManagePlan}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryPillBtnText}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  brandIconWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 30,
  },
  switchBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  switchBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchBannerTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111111",
  },
  switchBannerBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  switchBannerBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  bigCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  bigCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bigCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
    letterSpacing: -0.3,
  },
  cardHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moreIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  blackAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statTile: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statTileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statTileNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
    letterSpacing: -0.5,
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  statTileLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "400",
    marginTop: 4,
  },
  leadsListContainer: {
    gap: 12,
  },
  creatorLeadCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  creatorTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  creatorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111111",
  },
  creatorRole: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "400",
  },
  creatorActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniActionBtn: {
    padding: 4,
  },
  creatorSnippet: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
    fontWeight: "400",
    marginBottom: 12,
  },
  creatorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
    paddingTop: 10,
  },
  creatorMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorMetaText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "400",
  },
  activePill: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activePillText: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "500",
  },
  subscriptionBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  subscriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subKey: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "400",
  },
  subVal: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111111",
  },
  actionsStack: {
    gap: 10,
  },
  primaryPillBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryPillBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryPillBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryPillBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111111",
  },
});
