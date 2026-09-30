import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Check,
  MapPin,
  Crown,
  X,
  MoreVertical,
} from "lucide-react-native";
import COLORS from "../../constants/colors";

const ALL_LOCALITY_NAMES = [
  "Anna Nagar",
  "Kilpauk",
  "Mogappair",
  "Adyar",
  "Velachery",
  "T. Nagar",
  "Porur",
  "Guindy",
  "Nungambakkam",
  "Tambaram",
  "Alwarpet",
  "Besant Nagar",
  "ECR",
  "OMR",
  "Thiruvanmiyur",
  "Vadapalani",
  "Ambattur",
  "Kodambakkam",
  "Perambur",
  "Medavakkam",
  "Perungudi",
  "Sholinganallur",
  "Kotturpuram",
  "Mylapore",
  "Royapettah",
];

export default function AgentLocationSelectScreen({ route, navigation }) {
  // Plan passed from MenuScreen
  const initialPlan = route?.params?.plan || {
    id: "agent-pro",
    name: "Agent Pro Plan",
    locationLimit: 10,
    price: "₹6,999",
    priceNumeric: 6999,
    validity: "30 Days",
  };

  const [currentPlan, setCurrentPlan] = useState(initialPlan);
  const locationLimit = currentPlan.locationLimit || 10;

  // Selected localities state
  const initialSelected = route?.params?.selectedLocalities || [
    "Anna Nagar",
    "Kilpauk",
    "Mogappair",
    "Adyar",
  ];
  const [selectedLocalities, setSelectedLocalities] = useState(
    initialSelected.slice(0, locationLimit)
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCount = selectedLocalities.length;
  const isLimitReached = selectedCount >= locationLimit;

  // Plan tiers for quick switching if user wants to upgrade/downgrade
  const PLAN_TIERS = [
    { limit: 5, label: "5 Locations", name: "Agent Starter", price: "₹2,999" },
    { limit: 10, label: "10 Locations", name: "Agent Pro", price: "₹6,999", badge: "Popular" },
    { limit: 15, label: "15 Locations", name: "Elite Agency", price: "₹14,999" },
  ];

  const handleSelectTier = (tier) => {
    setCurrentPlan((prev) => ({
      ...prev,
      name: tier.name,
      locationLimit: tier.limit,
      price: tier.price,
      priceNumeric: parseInt(tier.price.replace(/[^0-9]/g, "")) || 6999,
    }));
    // If current selection exceeds new limit, slice it
    if (selectedLocalities.length > tier.limit) {
      setSelectedLocalities((prev) => prev.slice(0, tier.limit));
    }
  };

  // Filter localities based on search
  const filteredLocalities = useMemo(() => {
    if (!searchQuery.trim()) return ALL_LOCALITY_NAMES;
    const q = searchQuery.toLowerCase().trim();
    return ALL_LOCALITY_NAMES.filter((loc) => loc.toLowerCase().includes(q));
  }, [searchQuery]);

  const toggleLocality = (locName) => {
    if (selectedLocalities.includes(locName)) {
      setSelectedLocalities((prev) => prev.filter((item) => item !== locName));
    } else {
      if (isLimitReached) {
        Alert.alert(
          "Limit Reached",
          `You have reached your ${locationLimit}-location limit for this plan. You can upgrade to a higher tier or deselect an existing location.`
        );
        return;
      }
      setSelectedLocalities((prev) => [...prev, locName]);
    }
  };

  const handleContinue = () => {
    if (selectedCount === 0) {
      Alert.alert("Selection Required", "Please select at least 1 locality to continue.");
      return;
    }
    navigation.navigate("AgentPlanConfirm", {
      plan: currentPlan,
      selectedLocalities,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER: Circular Back Button | Centered Title | Circular More Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#111111" strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Choose Your Locations</Text>
          <Text style={styles.headerSubtitle}>
            {selectedCount} of {locationLimit} Localities Selected
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() =>
            Alert.alert(
              "Location Coverage",
              `Select up to ${locationLimit} prime locations in Chennai where you want to receive exclusive buyer enquiries.`
            )
          }
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MoreVertical size={20} color="#111111" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tier Selector Card */}
        <View style={styles.cardBox}>
          <View style={styles.tierHeaderRow}>
            <Text style={styles.cardTitle}>Coverage Tier</Text>
            <View style={styles.activeTierBadge}>
              <Crown size={12} color="#D97706" style={{ marginRight: 4 }} />
              <Text style={styles.activeTierBadgeText}>{currentPlan.name}</Text>
            </View>
          </View>
          <View style={styles.tierPillsRow}>
            {PLAN_TIERS.map((tier) => {
              const isTierActive = locationLimit === tier.limit;
              return (
                <TouchableOpacity
                  key={tier.limit}
                  style={[styles.tierPill, isTierActive && styles.tierPillActive]}
                  onPress={() => handleSelectTier(tier)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tierPillLabel, isTierActive && styles.tierPillLabelActive]}>
                    {tier.label}
                  </Text>
                  <Text style={[styles.tierPillPrice, isTierActive && styles.tierPillPriceActive]}>
                    {tier.price}
                  </Text>
                  {tier.badge && (
                    <View style={styles.tierMiniBadge}>
                      <Text style={styles.tierMiniBadgeText}>{tier.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Localities Chips Carousel */}
        {selectedLocalities.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionLabel}>
              Selected Localities ({selectedLocalities.length})
            </Text>
            <View style={styles.selectedChipsWrap}>
              {selectedLocalities.map((loc) => (
                <View key={loc} style={styles.selectedLocalityChip}>
                  <MapPin size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.selectedLocalityChipText}>{loc}</Text>
                  <TouchableOpacity
                    onPress={() => toggleLocality(loc)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.removeChipBtn}
                  >
                    <X size={12} color="#64748B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Search Field */}
        <View style={styles.searchCard}>
          <View style={styles.searchInputRow}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Chennai locality..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Localities List Card */}
        <View style={styles.localitiesCard}>
          {filteredLocalities.map((loc, index) => {
            const isSelected = selectedLocalities.includes(loc);
            const isDisabled = isLimitReached && !isSelected;
            const isLast = index === filteredLocalities.length - 1;

            return (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.localityRow,
                  !isLast && styles.localityRowBorder,
                  isDisabled && styles.localityRowDisabled,
                ]}
                onPress={() => toggleLocality(loc)}
                activeOpacity={isDisabled ? 1 : 0.75}
              >
                <View style={styles.localityLeft}>
                  <View style={[styles.pinIconBox, isSelected && styles.pinIconBoxSelected]}>
                    <MapPin size={16} color={isSelected ? "#2563EB" : "#64748B"} />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.localityName,
                        isSelected && styles.localityNameSelected,
                        isDisabled && styles.localityNameDisabled,
                      ]}
                    >
                      {loc}
                    </Text>
                    <Text style={styles.localityRegion}>Chennai Prime Zone</Text>
                  </View>
                </View>

                {/* Right Circle Check Indicator */}
                <View
                  style={[
                    styles.radioCircle,
                    isSelected ? styles.radioCircleSelected : styles.radioCircleUnselected,
                    isDisabled && styles.radioCircleDisabled,
                  ]}
                >
                  {isSelected && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* BOTTOM FIXED CTA: Sleek Rounded Pill "Continue" */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueBtn, selectedCount === 0 && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={selectedCount === 0}
          activeOpacity={0.88}
        >
          <Text style={[styles.continueBtnText, selectedCount === 0 && styles.continueBtnTextDisabled]}>
            Continue ({selectedCount}/{locationLimit})
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "400",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  cardBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
  },
  tierHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  activeTierBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTierBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B45309",
  },
  tierPillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tierPill: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  tierPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
    borderWidth: 1.5,
  },
  tierPillLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 2,
  },
  tierPillLabelActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
  tierPillPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111111",
  },
  tierPillPriceActive: {
    color: "#2563EB",
  },
  tierMiniBadge: {
    position: "absolute",
    top: -8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierMiniBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  selectedSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedLocalityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedLocalityChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2563EB",
    marginRight: 4,
  },
  removeChipBtn: {
    padding: 2,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#111111",
    fontWeight: "500",
  },
  localitiesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  localityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  localityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  localityRowDisabled: {
    opacity: 0.45,
  },
  localityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pinIconBoxSelected: {
    backgroundColor: "#EFF6FF",
  },
  localityName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111111",
  },
  localityNameSelected: {
    fontWeight: "600",
    color: "#2563EB",
  },
  localityNameDisabled: {
    color: "#94A3B8",
  },
  localityRegion: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    backgroundColor: "#2563EB",
  },
  radioCircleUnselected: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  radioCircleDisabled: {
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: "#FFFFFF",
  },
  continueBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  continueBtnDisabled: {
    backgroundColor: "#E2E8F0",
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  continueBtnTextDisabled: {
    color: "#94A3B8",
  },
});
