import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import {
  MapPin,
  Search as SearchIcon,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  Heart,
  Star,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Circle,
} from "lucide-react-native";
import COLORS from "../constants/colors";
import TYPOGRAPHY from "../constants/typography";
import ALL_PROPERTIES from "../data/properties";
import { useWishlist } from "../context/WishlistContext";
import PropertyDetailModal from "../components/PropertyDetailModal";

const POPULAR_LOCALITIES = [
  "Anna Nagar",
  "OMR",
  "Velachery",
  "ECR",
  "T. Nagar",
  "Tambaram",
  "Adyar",
  "Guindy",
];

const PROPERTY_TYPES = ["Apartment", "Villa", "House", "Commercial", "Plot"];

const BUDGET_PRESETS = [
  { label: "Under ₹50L", min: 0, max: 5000000 },
  { label: "₹50L - ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr - ₹2Cr", min: 10000000, max: 20000000 },
  { label: "₹2Cr+", min: 20000000, max: Infinity },
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

const CONSTRUCTION_STATUSES = ["Ready to move", "New Launch", "Under Construction"];

export default function SearchScreen({ navigation }) {
  // Mode: "filter" (minimalist filter screen) or "results" (showing matched listings)
  const [viewMode, setViewMode] = useState("filter");

  // Selected property for detail modal
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Filter states
  const [dealTab, setDealTab] = useState("Buy"); // Buy / Rent / Lease
  const [city] = useState("Chennai");
  const [selectedLocality, setSelectedLocality] = useState("Anna Nagar");
  const [localityQuery, setLocalityQuery] = useState("");
  const [isSelectingLocality, setIsSelectingLocality] = useState(false);

  const [selectedType, setSelectedType] = useState("Apartment");
  const [selectedBudget, setSelectedBudget] = useState("₹1Cr - ₹2Cr");
  const [selectedBhk, setSelectedBhk] = useState("3 BHK");
  const [constructionStatus, setConstructionStatus] = useState("Ready to move");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { isWishlisted, toggleWishlist } = useWishlist();

  // Compute matching properties dynamically based on current filter values
  const matchedProperties = useMemo(() => {
    return ALL_PROPERTIES.filter((item) => {
      // Deal type
      if (dealTab === "Buy" && item.badgeType !== "sale") return false;
      if (dealTab === "Rent" && item.badgeType !== "rent") return false;
      if (dealTab === "Lease" && item.badgeType !== "lease") return false;

      // Property type
      if (selectedType && selectedType !== "All") {
        if (item.type.toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      // BHK
      if (selectedBhk && item.beds > 0) {
        const bhkNum = parseInt(selectedBhk);
        if (selectedBhk === "4+ BHK") {
          if (item.beds < 4) return false;
        } else if (item.beds !== bhkNum) {
          return false;
        }
      }

      // Locality
      if (selectedLocality && selectedLocality !== "All") {
        if (!item.location.toLowerCase().includes(selectedLocality.toLowerCase())) {
          // If strict locality yields none, allow matches within city for demo
        }
      }

      return true;
    });
  }, [dealTab, selectedType, selectedBhk, selectedLocality]);

  // For display counter in filter screen
  const totalResultsCount = matchedProperties.length > 0 ? matchedProperties.length : ALL_PROPERTIES.length;

  const handleResetFilters = () => {
    setSelectedLocality("Anna Nagar");
    setSelectedType("Apartment");
    setSelectedBudget("₹1Cr - ₹2Cr");
    setSelectedBhk("3 BHK");
    setConstructionStatus("Ready to move");
    setShowMoreFilters(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ========================================================================= */}
      {/* VIEW 1: MINIMALIST BUYER SEARCH FILTER                                    */}
      {/* ========================================================================= */}
      {viewMode === "filter" ? (
        <View style={styles.filterScreenWrapper}>
          <ScrollView
            style={styles.filterScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {/* Header: Title + Deal Tabs */}
            <View style={styles.headerBar}>
              <Text style={styles.screenTitle}>Buyer Search</Text>
              <View style={styles.dealTabs}>
                {["Buy", "Rent", "Lease"].map((tab) => {
                  const isActive = dealTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.dealTabItem, isActive && styles.dealTabItemActive]}
                      onPress={() => setDealTab(tab)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.dealTabText, isActive && styles.dealTabTextActive]}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Location & Locality Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.filterLabel}>Location</Text>
              <TouchableOpacity
                style={styles.locationSummaryPill}
                activeOpacity={0.7}
                onPress={() => setIsSelectingLocality(!isSelectingLocality)}
              >
                <MapPin size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.locationPillText}>
                  {city} {selectedLocality ? `• ${selectedLocality}` : ""}
                </Text>
              </TouchableOpacity>

              {/* Collapsible Locality Selector */}
              {isSelectingLocality && (
                <View style={styles.localityDropdown}>
                  <View style={styles.localityInputRow}>
                    <SearchIcon size={15} color={COLORS.muted} style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.localityInput}
                      placeholder="Search locality or landmark..."
                      placeholderTextColor={COLORS.muted}
                      value={localityQuery}
                      onChangeText={setLocalityQuery}
                    />
                  </View>
                  <Text style={styles.popularLabel}>Popular Localities in {city}</Text>
                  <View style={styles.chipsWrap}>
                    {POPULAR_LOCALITIES.filter((loc) =>
                      loc.toLowerCase().includes(localityQuery.toLowerCase())
                    ).map((loc) => {
                      const isSelected = selectedLocality === loc;
                      return (
                        <TouchableOpacity
                          key={loc}
                          style={[styles.localityChip, isSelected && styles.localityChipSelected]}
                          onPress={() => {
                            setSelectedLocality(loc);
                            setIsSelectingLocality(false);
                          }}
                        >
                          <Text style={[styles.localityChipText, isSelected && styles.localityChipTextSelected]}>
                            {loc}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Property Type Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.filterLabel}>Property Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowScroll}>
                {PROPERTY_TYPES.map((type) => {
                  const isSelected = selectedType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typePill, isSelected ? styles.typePillActive : styles.typePillInactive]}
                      onPress={() => setSelectedType(type)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.typePillText, isSelected && styles.typePillTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Budget Range Section */}
            <View style={styles.sectionCard}>
              <View style={styles.budgetHeader}>
                <Text style={styles.filterLabel}>Budget</Text>
                <Text style={styles.selectedBudgetText}>{selectedBudget}</Text>
              </View>
              <View style={styles.budgetTrack}>
                <View style={styles.budgetFill} />
                <View style={styles.budgetThumbLeft} />
                <View style={styles.budgetThumbRight} />
              </View>
              <View style={styles.budgetRangeRow}>
                <Text style={styles.rangeLimit}>₹20L</Text>
                <Text style={styles.rangeLimit}>₹5Cr</Text>
              </View>

              {/* Budget Preset Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowScroll}>
                {BUDGET_PRESETS.map((preset) => {
                  const isSelected = selectedBudget === preset.label;
                  return (
                    <TouchableOpacity
                      key={preset.label}
                      style={[styles.presetChip, isSelected && styles.presetChipActive]}
                      onPress={() => setSelectedBudget(preset.label)}
                    >
                      <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Bedrooms (BHK) Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.filterLabel}>BHK (Bedrooms)</Text>
              <View style={styles.bhkGrid}>
                {BHK_OPTIONS.map((bhk) => {
                  const isSelected = selectedBhk === bhk;
                  return (
                    <TouchableOpacity
                      key={bhk}
                      style={[styles.bhkChip, isSelected && styles.bhkChipActive]}
                      onPress={() => setSelectedBhk(bhk)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.bhkChipText, isSelected && styles.bhkChipTextActive]}>
                        {bhk}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* More Filters Accordion */}
            <View style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.moreFiltersToggle}
                onPress={() => setShowMoreFilters(!showMoreFilters)}
                activeOpacity={0.7}
              >
                <Text style={styles.moreFiltersText}>
                  {showMoreFilters ? "Fewer Filters" : "More Filters (Construction status, Posted by)"}
                </Text>
                {showMoreFilters ? (
                  <ChevronUp size={18} color={COLORS.primary} />
                ) : (
                  <ChevronDown size={18} color={COLORS.primary} />
                )}
              </TouchableOpacity>

              {showMoreFilters && (
                <View style={styles.moreFiltersBody}>
                  <Text style={[styles.filterLabel, { marginTop: 12 }]}>Construction Status</Text>
                  <View style={styles.chipsWrap}>
                    {CONSTRUCTION_STATUSES.map((status) => {
                      const isSelected = constructionStatus === status;
                      return (
                        <TouchableOpacity
                          key={status}
                          style={[styles.statusChip, isSelected && styles.statusChipActive]}
                          onPress={() => setConstructionStatus(status)}
                        >
                          {isSelected ? (
                            <CheckCircle2
                              size={14}
                              color={COLORS.primary}
                              style={{ marginRight: 6 }}
                            />
                          ) : (
                            <Circle
                              size={14}
                              color={COLORS.muted}
                              style={{ marginRight: 6 }}
                            />
                          )}
                          <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                            {status}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Sticky Bottom Action Bar */}
          <View style={styles.bottomActionBar}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleResetFilters}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.showPropertiesBtn}
              activeOpacity={0.85}
              onPress={() => setViewMode("results")}
            >
              <Text style={styles.showPropertiesBtnText}>
                Show {totalResultsCount} Properties
              </Text>
              <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: SEARCH RESULTS WITH ACTIVE FILTER BAR                             */
        /* ========================================================================= */
        <View style={styles.resultsScreenWrapper}>
          {/* Top Bar with Filter Summary */}
          <View style={styles.resultsTopBar}>
            <TouchableOpacity
              style={styles.backFilterBtn}
              onPress={() => setViewMode("filter")}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color="#0F172A" />
              <View style={styles.searchSummaryInfo}>
                <Text style={styles.summaryTitle}>
                  {selectedType} in {selectedLocality || city}
                </Text>
                <Text style={styles.summarySubtitle}>
                  {selectedBhk} • {dealTab} • {selectedBudget}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editFilterIconBtn}
              onPress={() => setViewMode("filter")}
            >
              <SlidersHorizontal size={16} color={COLORS.primary} />
              <Text style={styles.editFilterText}>Filters</Text>
            </TouchableOpacity>
          </View>

          {/* Results Count Header */}
          <View style={styles.resultsSubHeader}>
            <Text style={styles.resultsCountText}>
              Showing {matchedProperties.length > 0 ? matchedProperties.length : ALL_PROPERTIES.length} verified listings
            </Text>
          </View>

          {/* Results Listings */}
          <ScrollView
            style={styles.resultsListScroll}
            contentContainerStyle={styles.resultsListContent}
            showsVerticalScrollIndicator={false}
          >
            {(matchedProperties.length > 0 ? matchedProperties : ALL_PROPERTIES).map((property) => {
              const saved = isWishlisted(property.id);
              return (
                <TouchableOpacity
                  key={property.id}
                  style={styles.propertyResultCard}
                  activeOpacity={0.9}
                  onPress={() => setSelectedProperty(property)}
                >
                  <View style={styles.resultImageContainer}>
                    <Image source={{ uri: property.image }} style={styles.resultImage} />
                    <View style={styles.resultBadge}>
                      <Text style={styles.resultBadgeText}>{property.badge}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.heartResultBtn}
                      activeOpacity={0.8}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={() => toggleWishlist(property)}
                    >
                      <Heart
                        size={20}
                        color={saved ? "#FF0000" : "#FFFFFF"}
                        fill={saved ? "#FF0000" : "rgba(0,0,0,0.3)"}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.resultCardBody}>
                    <View style={styles.priceRow}>
                      <Text style={styles.resultPrice}>
                        {property.price}{property.pricePeriod}
                      </Text>
                      <View style={styles.resultRating}>
                        <Star size={13} color={COLORS.star} fill={COLORS.star} />
                        <Text style={styles.resultRatingText}>{property.rating}</Text>
                      </View>
                    </View>

                    <Text style={styles.resultTitle}>{property.title}</Text>

                    <View style={styles.locationRow}>
                      <MapPin size={13} color={COLORS.textSecondary} />
                      <Text style={styles.resultLocation}>{property.location}</Text>
                    </View>

                    <View style={styles.resultSpecsRow}>
                      <Text style={styles.resultSpecText}>🛏️ {property.beds} BHK</Text>
                      <Text style={styles.resultSpecDot}>•</Text>
                      <Text style={styles.resultSpecText}>🚿 {property.baths} Baths</Text>
                      <Text style={styles.resultSpecDot}>•</Text>
                      <Text style={styles.resultSpecText}>📐 {property.sqft} sqft</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ================= PROPERTY DETAIL MODAL ================= */}
      <PropertyDetailModal
        visible={!!selectedProperty}
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onSelectProperty={(p) => setSelectedProperty(p)}
        isWishlisted={isWishlisted}
        onToggleWishlist={toggleWishlist}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* ================= FILTER SCREEN STYLES ================= */
  filterScreenWrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  filterScrollView: {
    flex: 1,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  screenTitle: {
    ...TYPOGRAPHY.mainPageTitle,
    color: "#0F172A",
  },
  dealTabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dealTabItem: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  dealTabItemActive: {
    backgroundColor: COLORS.primary,
  },
  dealTabText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#64748B",
  },
  dealTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  /* Section Card (Minimalist Container) */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  filterLabel: {
    ...TYPOGRAPHY.sectionHeading,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 10,
  },

  /* Location Pill */
  locationSummaryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationPillText: {
    ...TYPOGRAPHY.bodyText,
    color: "#0F172A",
    fontWeight: "500",
  },
  localityDropdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  localityInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
  },
  localityInput: {
    flex: 1,
    ...TYPOGRAPHY.inputText,
    fontSize: 13,
    color: "#0F172A",
    outlineStyle: "none",
    borderWidth: 0,
  },
  popularLabel: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#94A3B8",
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  localityChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  localityChipSelected: {
    backgroundColor: "#EBF4FF",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  localityChipText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#475569",
  },
  localityChipTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  /* Horizontal Row Scroll for Types & Presets */
  rowScroll: {
    gap: 8,
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  typePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typePillInactive: {
    backgroundColor: "#FFFFFF",
  },
  typePillText: {
    ...TYPOGRAPHY.filterChip,
    color: "#475569",
  },
  typePillTextActive: {
    color: "#FFFFFF",
  },

  /* Budget Slider Minimal Display */
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedBudgetText: {
    ...TYPOGRAPHY.propertyPrice,
    fontSize: 15,
    color: COLORS.primary,
  },
  budgetTrack: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginVertical: 14,
    position: "relative",
  },
  budgetFill: {
    position: "absolute",
    left: "25%",
    right: "25%",
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  budgetThumbLeft: {
    position: "absolute",
    left: "23%",
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  budgetThumbRight: {
    position: "absolute",
    right: "23%",
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: COLORS.primary,
  },
  budgetRangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rangeLimit: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#94A3B8",
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  presetChipActive: {
    backgroundColor: "#EBF4FF",
    borderColor: COLORS.primary,
  },
  presetChipText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#475569",
  },
  presetChipTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  /* BHK Grid */
  bhkGrid: {
    flexDirection: "row",
    gap: 8,
  },
  bhkChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bhkChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  bhkChipText: {
    ...TYPOGRAPHY.filterChip,
    color: "#475569",
  },
  bhkChipTextActive: {
    color: "#FFFFFF",
  },

  /* More Filters Accordion */
  moreFiltersToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreFiltersText: {
    ...TYPOGRAPHY.button,
    fontSize: 13,
    color: COLORS.primary,
  },
  moreFiltersBody: {
    paddingTop: 8,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusChipActive: {
    backgroundColor: "#EBF4FF",
    borderColor: COLORS.primary,
  },
  statusChipText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#475569",
  },
  statusChipTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  /* Sticky Bottom Bar */
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  clearBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  clearBtnText: {
    ...TYPOGRAPHY.button,
    color: "#64748B",
  },
  showPropertiesBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  showPropertiesBtnText: {
    ...TYPOGRAPHY.button,
    color: "#FFFFFF",
  },

  /* ================= RESULTS SCREEN STYLES ================= */
  resultsScreenWrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  resultsTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchSummaryInfo: {
    marginLeft: 6,
  },
  summaryTitle: {
    ...TYPOGRAPHY.screenHeading,
    fontSize: 15,
    color: "#0F172A",
  },
  summarySubtitle: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#64748B",
    marginTop: 1,
  },
  editFilterIconBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#EBF4FF",
  },
  editFilterText: {
    ...TYPOGRAPHY.smallHelperText,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  resultsSubHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsCountText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#64748B",
  },
  resultsListScroll: {
    flex: 1,
  },
  resultsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  propertyResultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  resultImageContainer: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  resultBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(20, 110, 245, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  resultBadgeText: {
    ...TYPOGRAPHY.badge,
    color: "#FFFFFF",
  },
  heartResultBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  resultCardBody: {
    padding: 14,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  resultPrice: {
    ...TYPOGRAPHY.propertyPrice,
    color: COLORS.primary,
  },
  resultRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  resultRatingText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#0F172A",
    fontWeight: "600",
    marginLeft: 3,
  },
  resultTitle: {
    ...TYPOGRAPHY.propertyTitle,
    color: "#0F172A",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultLocation: {
    ...TYPOGRAPHY.location,
    color: "#64748B",
    marginLeft: 4,
  },
  resultSpecsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultSpecText: {
    ...TYPOGRAPHY.smallHelperText,
    color: "#475569",
  },
  resultSpecDot: {
    marginHorizontal: 6,
    color: "#CBD5E1",
  },
});
