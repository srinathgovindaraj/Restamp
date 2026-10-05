import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Search,
  SlidersHorizontal,
  Plus,
  Building2,
  X,
  Filter,
  ArrowLeft,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import RestampLogo from "../../components/RestampLogo";
import OwnerHeader from "../../components/owner/OwnerHeader";
import OwnerPropertyCard from "../../components/owner/OwnerPropertyCard";
import EmptyState from "../../components/owner/EmptyState";
import ConfirmationModal from "../../components/owner/ConfirmationModal";
import OwnerPropertyDetailModal from "./OwnerPropertyDetailModal";

const STATUS_TABS = [
  "All",
  "Active",
  "Pending",
  "Rejected",
  "Expired",
  "Closed",
  "Draft",
];

export default function OwnerPropertiesScreen({ route, navigation }) {
  const {
    properties,
    updatePropertyStatus,
    deleteProperty,
  } = useOwner();

  const initialTab = route?.params?.initialTab || "All";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);


  const handleSwitchToBuyer = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  // Modals state
  const [selectedPropertyForPreview, setSelectedPropertyForPreview] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "primary",
  });

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Tab filter
      if (activeTab !== "All") {
        if (activeTab === "Pending" && prop.status !== "pending") return false;
        if (activeTab === "Active" && prop.status !== "active") return false;
        if (activeTab === "Rejected" && prop.status !== "rejected") return false;
        if (activeTab === "Expired" && prop.status !== "expired") return false;
        if (activeTab === "Closed" && prop.status !== "closed") return false;
        if (activeTab === "Draft" && prop.status !== "draft") return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocality = prop.locality?.toLowerCase().includes(query);
        const matchesAddress = prop.address?.toLowerCase().includes(query);
        return matchesTitle || matchesLocality || matchesAddress;
      }

      return true;
    });
  }, [properties, activeTab, searchQuery]);

  // Handlers for property card actions
  const handleViewLeads = (property) => {
    navigation.navigate("Leads", { propertyId: property.id });
  };

  const handleViewProperty = (property) => {
    setSelectedPropertyForPreview(property);
  };

  const handleEditProperty = (property) => {
    navigation.navigate("Add", { editingProperty: property });
  };

  const handlePauseListing = (property) => {
    setConfirmModal({
      visible: true,
      title: "Pause Listing?",
      message: `Pausing "${property.title}" will temporarily hide it from buyer searches. You can resume anytime.`,
      variant: "primary",
      confirmText: "Pause",
      onConfirm: () => {
        updatePropertyStatus(property.id, "closed", { pauseReason: "Owner Paused" });
        setConfirmModal((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const handleCloseListing = (property) => {
    setConfirmModal({
      visible: true,
      title: "Close Listing?",
      message: `Mark "${property.title}" as closed? This indicates the property was rented, sold, or taken off market.`,
      variant: "primary",
      confirmText: "Close Listing",
      onConfirm: () => {
        updatePropertyStatus(property.id, "closed", { closedOutcome: "Closed by Owner" });
        setConfirmModal((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const handleDeleteDraft = (property) => {
    setConfirmModal({
      visible: true,
      title: "Delete Draft?",
      message: "Are you sure you want to delete this listing draft? This cannot be undone.",
      variant: "danger",
      confirmText: "Delete Draft",
      onConfirm: () => {
        deleteProperty(property.id);
        setConfirmModal((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const handleResubmit = (property) => {
    navigation.navigate("Add", {
      editingProperty: property,
      initialStep: 5, // Jump to media/documents to fix issues
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER: Brand Logo | Subtitle & Title | Search & Add Circle Buttons */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.brandIconWrapper}>
            <RestampLogo size={32} />
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.headerSubtitle}>RESTAMP Owner Studio</Text>
            <Text style={styles.headerTitle}>My Properties</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerCircleBtn, showSearch && styles.headerCircleBtnActive]}
            onPress={() => setShowSearch(!showSearch)}
            activeOpacity={0.7}
          >
            <Search size={19} color={showSearch ? COLORS.primary : "#111111"} strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addPropertyCircleBtn}
            onPress={() => navigation.navigate("Add")}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scrollable View */}
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

        {/* Search Input Bar (Expandable) */}
        {showSearch && (
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarCard}>
              <Search size={16} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title, locality or address..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
                  <X size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Horizontally Scrollable Status Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {STATUS_TABS.map((tab) => {
              const count =
                tab === "All"
                  ? properties.length
                  : properties.filter((p) => p.status.toLowerCase() === tab.toLowerCase()).length;
              const isActive = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabChip, isActive && styles.tabChipActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab}
                  </Text>
                  <View style={[styles.tabCountBadge, isActive && styles.tabCountBadgeActive]}>
                    <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {filteredProperties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={activeTab === "All" ? "No Properties Yet" : `No ${activeTab} Properties`}
            description={
              activeTab === "All"
                ? "Start by adding your first property to receive verified buyer enquiries."
                : `You currently have zero properties under the ${activeTab} category.`
            }
            buttonTitle="+ Add Property"
            onButtonPress={() => navigation.navigate("Add")}
          />
        ) : (
          filteredProperties.map((prop) => (
            <OwnerPropertyCard
              key={prop.id}
              property={prop}
              onViewLeads={handleViewLeads}
              onViewProperty={handleViewProperty}
              onEditProperty={handleEditProperty}
              onPauseListing={handlePauseListing}
              onCloseListing={handleCloseListing}
              onDeleteDraft={handleDeleteDraft}
              onResubmit={handleResubmit}
            />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, visible: false }))}
      />

      {/* Full Preview Modal for Owner */}
      <OwnerPropertyDetailModal
        visible={Boolean(selectedPropertyForPreview)}
        property={selectedPropertyForPreview}
        onClose={() => setSelectedPropertyForPreview(null)}
        onEdit={(prop) => {
          setSelectedPropertyForPreview(null);
          handleEditProperty(prop);
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
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
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
  headerTitle: {
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
    borderColor: "#EEF2F6",
  },
  headerCircleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EFF6FF",
  },
  addPropertyCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  searchBarCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: COLORS.textDark,
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 10,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  tabChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tabCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: "#EEF2F6",
  },
  tabCountBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  tabCountTextActive: {
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  switchBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
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
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
  },
  moreIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statTile: {
    width: "48%",
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
    fontWeight: "500",
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
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
    marginTop: 4,
  },
});
