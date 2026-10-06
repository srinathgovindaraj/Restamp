import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Linking,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Share2,
  ChevronDown,
  Building2,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
  ShieldCheck,
  X,
  Users,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useAgent } from "../../context/AgentContext";
import PropertyDetailModal from "../../components/PropertyDetailModal";

const DEAL_TYPES = ["All", "Rent", "Buy", "Lease"];
const PROPERTY_TYPES = ["All Types", "Apartment", "Villa", "House", "Commercial", "Plot"];
const BHK_OPTIONS = ["All BHK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

export default function AgentPropertiesScreen({ navigation }) {
  const {
    selectedLocalities,
    localityProperties,
    leads,
    matchPropertyToLead,
    isPlanExpired,
  } = useAgent();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDealType, setSelectedDealType] = useState("All");
  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedBhk, setSelectedBhk] = useState("All BHK");

  // Selected property for detail view modal
  const [activePropertyModal, setActivePropertyModal] = useState(null);

  // Match Lead sheet state
  const [matchingProperty, setMatchingProperty] = useState(null);

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    return localityProperties.filter((item) => {
      // Deal type
      if (selectedDealType === "Rent" && item.badgeType !== "rent") return false;
      if (selectedDealType === "Buy" && item.badgeType !== "sale" && item.badgeType !== "resale") return false;
      if (selectedDealType === "Lease" && item.badgeType !== "lease") return false;

      // Locality dropdown filter
      if (selectedLocalityFilter !== "All Locations") {
        const itemLoc = (item.location || "").toLowerCase();
        if (!itemLoc.includes(selectedLocalityFilter.toLowerCase())) return false;
      }

      // Property type
      if (selectedType !== "All Types") {
        if ((item.type || "").toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      // BHK
      if (selectedBhk !== "All BHK") {
        const num = parseInt(selectedBhk);
        if (selectedBhk === "4+ BHK") {
          if ((item.beds || 0) < 4) return false;
        } else if ((item.beds || 0) !== num) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const locMatch = (item.location || "").toLowerCase().includes(q);
        const addrMatch = (item.address || "").toLowerCase().includes(q);
        if (!titleMatch && !locMatch && !addrMatch) return false;
      }

      return true;
    });
  }, [
    localityProperties,
    selectedDealType,
    selectedLocalityFilter,
    selectedType,
    selectedBhk,
    searchQuery,
  ]);

  const handleContactOwner = (item, type = "whatsapp") => {
    const rawPhone = item.ownerPhone || "+919840012345";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

    if (type === "whatsapp") {
      const text = encodeURIComponent(
        `Hello! I am an active RESTAMP Certified Agent regarding your property listing "${item.title}" in ${item.location}. I have active buyer inquiries and would like to arrange a site visit.`
      );
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${text}`).catch(() => {
        Alert.alert("WhatsApp Unavailable", `Contact Owner at ${rawPhone}`);
      });
    } else {
      Linking.openURL(`tel:${cleanPhone}`).catch(() => {
        Alert.alert("Call Contact", `Owner Phone: ${rawPhone}`);
      });
    }
  };

  const handleOpenMatchSheet = (property) => {
    setMatchingProperty(property);
  };

  const handleConfirmMatch = (lead) => {
    if (!matchingProperty) return;
    matchPropertyToLead(lead.id, matchingProperty);
    setMatchingProperty(null);
    Alert.alert(
      "Lead Matched!",
      `Successfully matched "${matchingProperty.title}" with client ${lead.customerName}. You can now schedule a site visit or share via WhatsApp.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Available Properties</Text>
          <Text style={styles.headerSubtitle}>
            Owner-listed homes in your {selectedLocalities.length} covered areas
          </Text>
        </View>

        <View style={styles.headerBadge}>
          <ShieldCheck size={14} color="#16A34A" style={{ marginRight: 4 }} />
          <Text style={styles.headerBadgeText}>Owner Listed</Text>
        </View>
      </View>

      {/* SEARCH AND FILTERS CONTAINER */}
      <View style={styles.filterTopSection}>
        {/* Search input */}
        <View style={styles.searchBar}>
          <Search size={17} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in your covered localities..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills Scroll (Deal, Locality, Type, BHK) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {/* Deal Tabs */}
          {DEAL_TYPES.map((deal) => (
            <TouchableOpacity
              key={deal}
              style={[styles.filterChip, selectedDealType === deal && styles.filterChipActive]}
              onPress={() => setSelectedDealType(deal)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedDealType === deal && styles.filterChipTextActive,
                ]}
              >
                {deal}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Localities from Agent Plan */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedLocalityFilter !== "All Locations" && styles.filterChipActive,
            ]}
            onPress={() => {
              // Cycle through agent's localities or show sheet
              const options = ["All Locations", ...selectedLocalities];
              const curIdx = options.indexOf(selectedLocalityFilter);
              const nextIdx = (curIdx + 1) % options.length;
              setSelectedLocalityFilter(options[nextIdx]);
            }}
            activeOpacity={0.8}
          >
            <MapPin
              size={12}
              color={selectedLocalityFilter !== "All Locations" ? "#2563EB" : "#64748B"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedLocalityFilter !== "All Locations" && styles.filterChipTextActive,
              ]}
            >
              {selectedLocalityFilter}
            </Text>
          </TouchableOpacity>

          {/* Property Types */}
          {PROPERTY_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
              onPress={() => setSelectedType(type)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedType === type && styles.filterChipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PROPERTIES LIST */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsInfoRow}>
          <Text style={styles.resultsCountText}>
            Showing <Text style={{ fontWeight: "700", color: "#0F172A" }}>{filteredProperties.length}</Text> properties
          </Text>
          <Text style={styles.resultsLocationText}>
            Locations: {selectedLocalities.slice(0, 3).join(", ")}
            {selectedLocalities.length > 3 ? ` +${selectedLocalities.length - 3}` : ""}
          </Text>
        </View>

        {filteredProperties.length === 0 ? (
          <View style={styles.emptyState}>
            <Building2 size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No matching properties</Text>
            <Text style={styles.emptySub}>
              Try adjusting your filters or expanding your locality coverage.
            </Text>
          </View>
        ) : (
          <View style={styles.propertiesGrid}>
            {filteredProperties.map((item) => (
              <View key={item.id} style={styles.propertyCard}>
                {/* Image and Badges */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setActivePropertyModal(item)}
                  style={styles.cardImageContainer}
                >
                  <Image source={{ uri: item.image }} style={styles.cardImage} />

                  <View style={styles.imageTopBadges}>
                    <View style={styles.ownerBadge}>
                      <Text style={styles.ownerBadgeText}>Owner Listed</Text>
                    </View>
                    {item.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <CheckCircle2 size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
                        <Text style={styles.verifiedBadgeText}>Verified</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.pricePill}>
                    <Text style={styles.pricePillText}>{item.price}</Text>
                  </View>
                </TouchableOpacity>

                {/* Card Body */}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <View style={styles.cardLocRow}>
                    <MapPin size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.cardLocText} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>

                  {/* Specs / Highlights */}
                  <View style={styles.specsRow}>
                    <View style={styles.specItem}>
                      <Bed size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.specText}>{item.beds || 2} BHK</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                      <Maximize2 size={13} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.specText}>{item.sqft || 1200} sqft</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.specItem}>
                      <Text style={styles.specText}>{item.furnishing || "Semi Furnished"}</Text>
                    </View>
                  </View>

                  {/* Agent Action Buttons: View Property | Match Lead | Contact Owner */}
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      style={styles.btnViewProperty}
                      onPress={() => setActivePropertyModal(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnViewPropertyText}>View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnMatchLead}
                      onPress={() => handleOpenMatchSheet(item)}
                      activeOpacity={0.8}
                    >
                      <Users size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.btnMatchLeadText}>Match Lead</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnContactOwner}
                      onPress={() => handleContactOwner(item, "whatsapp")}
                      activeOpacity={0.8}
                    >
                      <MessageCircle size={14} color="#16A34A" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnCallOwner}
                      onPress={() => handleContactOwner(item, "call")}
                      activeOpacity={0.8}
                    >
                      <Phone size={14} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* MATCH LEAD BOTTOM SHEET MODAL */}
      <Modal
        visible={!!matchingProperty}
        transparent
        animationType="slide"
        onRequestClose={() => setMatchingProperty(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.matchSheetContainer}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Match Property with Lead</Text>
                <Text style={styles.sheetSubtitle} numberOfLines={1}>
                  {matchingProperty?.title} • {matchingProperty?.location}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeSheetBtn}
                onPress={() => setMatchingProperty(null)}
              >
                <X size={18} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSelectLeadLabel}>Select an Active Client Lead:</Text>

            <ScrollView style={styles.leadsSheetScroll} showsVerticalScrollIndicator={false}>
              {leads.map((lead) => (
                <TouchableOpacity
                  key={lead.id}
                  style={styles.sheetLeadItem}
                  onPress={() => handleConfirmMatch(lead)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: lead.avatar }} style={styles.sheetLeadAvatar} />
                  <View style={styles.sheetLeadInfo}>
                    <Text style={styles.sheetLeadName}>{lead.customerName}</Text>
                    <Text style={styles.sheetLeadReq} numberOfLines={1}>
                      {lead.requirement} • {lead.preferredLocality}
                    </Text>
                    <Text style={styles.sheetLeadBudget}>Budget: {lead.budget}</Text>
                  </View>
                  <View style={styles.matchPill}>
                    <Text style={styles.matchPillText}>Assign</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PROPERTY DETAIL MODAL (REUSED FULL-FEATURED MODAL) */}
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
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  filterTopSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F6",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
  },
  filterScroll: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  filterChipTextActive: {
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
  resultsInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultsCountText: {
    fontSize: 12,
    color: "#64748B",
  },
  resultsLocationText: {
    fontSize: 11,
    color: "#94A3B8",
    maxWidth: "50%",
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
  propertiesGrid: {
    gap: 16,
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  cardImageContainer: {
    height: 180,
    width: "100%",
    position: "relative",
    backgroundColor: "#F1F5F9",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  imageTopBadges: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    gap: 6,
  },
  ownerBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  pricePill: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pricePillText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  cardLocRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  cardLocText: {
    fontSize: 12,
    color: "#64748B",
  },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 12,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  specText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
  },
  specDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnViewProperty: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 9,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  btnViewPropertyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  btnMatchLead: {
    flex: 1.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingVertical: 9,
    borderRadius: 100,
  },
  btnMatchLeadText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  btnContactOwner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  btnCallOwner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  matchSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "75%",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  sheetSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    maxWidth: 260,
  },
  closeSheetBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSelectLeadLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  leadsSheetScroll: {
    maxHeight: 320,
  },
  sheetLeadItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  sheetLeadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sheetLeadInfo: {
    flex: 1,
  },
  sheetLeadName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetLeadReq: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  sheetLeadBudget: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  matchPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  matchPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
