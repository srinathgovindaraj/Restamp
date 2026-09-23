import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../constants/colors";
import TourCard from "../components/TourCard";
import TourDetailModal from "../components/TourDetailModal";
import DestinationDetailModal from "../components/DestinationDetailModal";
import tours from "../data/tours";
import destinations from "../data/destinations";
import { useWishlist } from "../context/WishlistContext";

// Exclusive Offers Data
const OFFERS = [
  {
    id: "off-1",
    title: "Summer Getaway",
    discount: "25% OFF",
    code: "SUMMER25",
    subtitle: "On all beach & tropical island expeditions",
    badge: "Limited Time",
    gradientColors: ["#0075FF", "#00B4D8"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    validTill: "Valid till Sep 30",
  },
  {
    id: "off-2",
    title: "Alpine Adventure",
    discount: "Flat $300 OFF",
    code: "PEAK300",
    subtitle: "On Swiss Alps & Patagonia mountain treks",
    badge: "Special Deal",
    gradientColors: ["#4F46E5", "#7C3AED"],
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    validTill: "Valid till Oct 15",
  },
  {
    id: "off-3",
    title: "Early Bird Escape",
    discount: "Save $200",
    code: "EARLY2026",
    subtitle: "Book 30 days ahead for complimentary VIP perks",
    badge: "Exclusive",
    gradientColors: ["#EA580C", "#F59E0B"],
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
    validTill: "Valid till Nov 01",
  },
];

// Categories for Modal Filter
const CATEGORIES = [
  { id: "All", label: "All", icon: "apps-outline" },
  { id: "Beach", label: "Beach", icon: "sunny-outline" },
  { id: "Mountain", label: "Mountain", icon: "triangle-outline" },
  { id: "City", label: "City", icon: "business-outline" },
  { id: "Culture", label: "Culture", icon: "color-palette-outline" },
  { id: "Adventure", label: "Adventure", icon: "trail-sign-outline" },
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended", icon: "sparkles-outline" },
  { id: "rating", label: "Highest Rated", icon: "star-outline" },
  { id: "price_asc", label: "Price: Low to High", icon: "arrow-up-outline" },
  { id: "price_desc", label: "Price: High to Low", icon: "arrow-down-outline" },
];

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under_1500", label: "Under $1,500" },
  { id: "1500_2200", label: "$1,500 - $2,200" },
  { id: "above_2200", label: "Above $2,200" },
];

const RATING_OPTIONS = [
  { id: "all", label: "All Ratings" },
  { id: "4.8", label: "4.8+ Stars" },
  { id: "4.9", label: "4.9 Stars only" },
];

export default function HomeScreen() {
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");

  // Modal Visibility for Details
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showAllTours, setShowAllTours] = useState(false);

  // Slider Refs and Scroll Offsets
  const destinationsScrollRef = useRef(null);
  const offersScrollRef = useRef(null);
  const destinationsOffset = useRef(0);
  const offersOffset = useRef(0);

  const scrollDestinations = (direction) => {
    const cardStep = 182; // card width (170) + gap (12)
    const maxOffset = Math.max(0, (destinations.length - 2) * cardStep);
    const newOffset =
      direction === "right"
        ? Math.min(maxOffset, destinationsOffset.current + cardStep)
        : Math.max(0, destinationsOffset.current - cardStep);

    destinationsScrollRef.current?.scrollToOffset({
      offset: newOffset,
      animated: true,
    });
    destinationsOffset.current = newOffset;
  };

  const scrollOffers = (direction) => {
    const cardStep = 284; // card width (270) + gap (14)
    const maxOffset = Math.max(0, (OFFERS.length - 1) * cardStep);
    const newOffset =
      direction === "right"
        ? Math.min(maxOffset, offersOffset.current + cardStep)
        : Math.max(0, offersOffset.current - cardStep);

    offersScrollRef.current?.scrollToOffset({
      offset: newOffset,
      animated: true,
    });
    offersOffset.current = newOffset;
  };

  // Filter Modal Visibility & Staged States
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [stagedCategory, setStagedCategory] = useState("All");
  const [stagedSortBy, setStagedSortBy] = useState("recommended");
  const [stagedPriceRange, setStagedPriceRange] = useState("all");
  const [stagedMinRating, setStagedMinRating] = useState("all");

  // Filter Modal Actions
  const handleOpenFilterModal = () => {
    setStagedCategory(selectedCategory);
    setStagedSortBy(sortBy);
    setStagedPriceRange(priceRange);
    setStagedMinRating(minRating);
    setIsFilterModalVisible(true);
  };

  const handleApplyFilters = () => {
    setSelectedCategory(stagedCategory);
    setSortBy(stagedSortBy);
    setPriceRange(stagedPriceRange);
    setMinRating(stagedMinRating);
    setIsFilterModalVisible(false);
  };

  const handleResetModalFilters = () => {
    setStagedCategory("All");
    setStagedSortBy("recommended");
    setStagedPriceRange("all");
    setStagedMinRating("all");
  };

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("recommended");
    setPriceRange("all");
    setMinRating("all");
  };

  // Count active non-default filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count += 1;
    if (sortBy !== "recommended") count += 1;
    if (priceRange !== "all") count += 1;
    if (minRating !== "all") count += 1;
    return count;
  }, [selectedCategory, sortBy, priceRange, minRating]);

  // Preview count inside filter modal
  const stagedMatchingCount = useMemo(() => {
    return tours.filter((tour) => {
      if (stagedCategory !== "All" && tour.category !== stagedCategory) return false;
      const numPrice = parseInt(tour.price.replace(/[^0-9]/g, ""), 10);
      if (stagedPriceRange === "under_1500" && numPrice >= 1500) return false;
      if (
        stagedPriceRange === "1500_2200" &&
        (numPrice < 1500 || numPrice > 2200)
      )
        return false;
      if (stagedPriceRange === "above_2200" && numPrice <= 2200) return false;
      if (
        stagedMinRating !== "all" &&
        parseFloat(tour.rating) < parseFloat(stagedMinRating)
      ) {
        return false;
      }
      return true;
    }).length;
  }, [stagedCategory, stagedPriceRange, stagedMinRating]);

  // Filtered and Sorted Tours
  const filteredTours = useMemo(() => {
    let result = tours.filter((tour) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          tour.title.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.category.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category
      if (selectedCategory !== "All" && tour.category !== selectedCategory) {
        return false;
      }

      // Price Range
      const numPrice = parseInt(tour.price.replace(/[^0-9]/g, ""), 10);
      if (priceRange === "under_1500" && numPrice >= 1500) return false;
      if (
        priceRange === "1500_2200" &&
        (numPrice < 1500 || numPrice > 2200)
      )
        return false;
      if (priceRange === "above_2200" && numPrice <= 2200) return false;

      // Rating
      if (
        minRating !== "all" &&
        parseFloat(tour.rating) < parseFloat(minRating)
      ) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => {
        const pA = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
        const pB = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
        return pA - pB;
      });
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => {
        const pA = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
        const pB = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
        return pB - pA;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, priceRange, minRating]);

  // Limit popular tours to only 4 cards unless 'See all' is toggled or searching/filtering
  const displayedTours = useMemo(() => {
    if (showAllTours || searchQuery.trim() || activeFiltersCount > 0) {
      return filteredTours;
    }
    return filteredTours.slice(0, 4);
  }, [filteredTours, showAllTours, searchQuery, activeFiltersCount]);

  const handleClaimOffer = (offer) => {
    Alert.alert(
      `Promo Code Applied! 🎟️`,
      `Code "${offer.code}" has been copied for ${offer.discount}. It will automatically apply at checkout.`,
      [{ text: "Awesome!" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={displayedTours}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* 1. LOCATION & USER HEADER */}
            <View style={styles.header}>
              <View style={styles.locationWrapper}>
                <Ionicons
                  name="location-sharp"
                  size={23}
                  color={COLORS.primary}
                />
                <View style={styles.locationText}>
                  <Text style={styles.locationLabel}>Location</Text>
                  <Text style={styles.locationValue}>Chennai, India</Text>
                </View>
              </View>

              <View style={styles.headerRight}>
                <Pressable style={styles.headerIcon}>
                  <Ionicons name="notifications" size={22} color={COLORS.textPrimary} />
                  <View style={styles.headerDot} />
                </Pressable>

                <View style={styles.profileCircle}>
                  <Ionicons name="person" size={20} color={COLORS.white} />
                </View>
              </View>
            </View>

            {/* 2. SEARCH BAR */}
            <View style={styles.search}>
              <Ionicons
                name="search"
                size={20}
                color={COLORS.textSecondary}
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Search destination, tour..."
                placeholderTextColor="#9A9A9A"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {searchQuery.length > 0 && (
                <Pressable
                  style={styles.clearSearchBtn}
                  onPress={() => setSearchQuery("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.filterBtn,
                  activeFiltersCount > 0 && styles.filterBtnActive,
                ]}
                onPress={handleOpenFilterModal}
              >
                <Ionicons
                  name="options"
                  size={20}
                  color={
                    activeFiltersCount > 0 ? COLORS.primary : COLORS.textPrimary
                  }
                />
                {activeFiltersCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {activeFiltersCount}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* 3. POPULAR TOURS SECTION HEADING (FIRST SECTION) */}
            <View style={[styles.sectionHeadingRow, { marginTop: 6, marginBottom: 12 }]}>
              <Text style={styles.sectionTitle}>Popular Tours</Text>

              {activeFiltersCount > 0 || searchQuery.length > 0 ? (
                <Pressable onPress={handleResetAllFilters}>
                  <Text style={styles.seeAll}>Reset filters</Text>
                </Pressable>
              ) : filteredTours.length > 4 ? (
                <Pressable onPress={() => setShowAllTours(!showAllTours)}>
                  <Text style={styles.seeAll}>
                    {showAllTours ? "Show less" : "See all"}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TourCard
            tour={item}
            isWishlisted={isWishlisted(item.id)}
            onToggleWishlist={() => toggleWishlist(item)}
            onPress={() => setSelectedTour(item)}
          />
        )}
        ListFooterComponent={
          !searchQuery.trim() && activeFiltersCount === 0 ? (
            <View style={styles.footerSections}>
              {/* FEATURED DESTINATIONS */}
              <View style={styles.destinationsSection}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionTitle}>Featured Destinations</Text>

                  <Pressable>
                    <Text style={styles.seeAll}>See all</Text>
                  </Pressable>
                </View>

                <FlatList
                  ref={destinationsScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  data={destinations}
                  keyExtractor={(item) => item.id}
                  style={styles.sliderList}
                  contentContainerStyle={styles.destinationsContent}
                  onScroll={(e) => {
                    destinationsOffset.current = e.nativeEvent.contentOffset.x;
                  }}
                  scrollEventThrottle={16}
                  renderItem={({ item: dest }) => (
                    <Pressable
                      style={styles.destinationCard}
                      onPress={() => setSelectedDestination(dest)}
                    >
                      <Image
                        source={{ uri: dest.image }}
                        style={styles.destinationImage}
                        resizeMode="cover"
                      />
                      <View style={styles.destinationOverlay} />

                      {/* Content Wrapper */}
                      <View style={styles.destinationCardContent}>
                        {/* Top Badges */}
                        <View style={styles.destinationTopBadges}>
                          <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={11} color="#FFB800" />
                            <Text style={styles.ratingBadgeText}>{dest.rating}</Text>
                          </View>
                          <View style={styles.tourCountBadge}>
                            <Text style={styles.tourCountBadgeText}>
                              {dest.tourCount}
                            </Text>
                          </View>
                        </View>

                        {/* Bottom Info */}
                        <View style={styles.destinationBottomInfo}>
                          <Text style={styles.destinationCountry}>
                            {dest.country}
                          </Text>
                          <Text style={styles.destinationName}>{dest.name}</Text>
                        </View>
                      </View>
                    </Pressable>
                  )}
                />
              </View>

              {/* EXCLUSIVE OFFERS */}
              <View style={styles.offersSection}>
                <View style={styles.sectionHeadingRow}>
                  <Text style={styles.sectionTitle}>Exclusive Offers</Text>
                </View>

                <FlatList
                  ref={offersScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  data={OFFERS}
                  keyExtractor={(item) => item.id}
                  style={styles.sliderList}
                  contentContainerStyle={styles.offersContent}
                  onScroll={(e) => {
                    offersOffset.current = e.nativeEvent.contentOffset.x;
                  }}
                  scrollEventThrottle={16}
                  renderItem={({ item: offer }) => (
                    <Pressable
                      style={styles.offerCard}
                      onPress={() => handleClaimOffer(offer)}
                    >
                      <Image
                        source={{ uri: offer.image }}
                        style={styles.offerImage}
                        resizeMode="cover"
                      />
                      <View style={styles.offerOverlay} />

                      {/* Content Wrapper */}
                      <View style={styles.offerCardContent}>
                        {/* Badge */}
                        <View style={styles.offerBadge}>
                          <Text style={styles.offerBadgeText}>{offer.badge}</Text>
                        </View>

                        {/* Offer Content */}
                        <View style={styles.offerContent}>
                          <Text style={styles.offerDiscount}>{offer.discount}</Text>
                          <Text style={styles.offerTitle}>{offer.title}</Text>
                          <Text style={styles.offerSubtitle} numberOfLines={1}>
                            {offer.subtitle}
                          </Text>

                          <View style={styles.offerFooter}>
                            <View style={styles.offerCodePill}>
                              <Ionicons name="pricetag" size={11} color={COLORS.white} />
                              <Text style={styles.offerCodeText}>{offer.code}</Text>
                            </View>
                            <Text style={styles.claimText}>Claim Deal →</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="search"
                size={36}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No tours found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find any tours matching your criteria. Try adjusting your search query or filters.
            </Text>
            <Pressable
              style={styles.emptyResetBtn}
              onPress={handleResetAllFilters}
            >
              <Text style={styles.emptyResetBtnText}>Reset All Filters</Text>
            </Pressable>
          </View>
        }
      />

      {/* TOUR DETAIL MODAL */}
      <TourDetailModal
        visible={!!selectedTour}
        tour={selectedTour}
        onClose={() => setSelectedTour(null)}
        isWishlisted={selectedTour ? isWishlisted(selectedTour.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* DESTINATION DETAIL MODAL */}
      <DestinationDetailModal
        visible={!!selectedDestination}
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onSelectTour={(t) => {
          setSelectedTour(t);
        }}
        isWishlisted={isWishlisted}
        onToggleWishlist={toggleWishlist}
      />

      {/* FILTER BOTTOM SHEET MODAL */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsFilterModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Filter Tours</Text>
                <Text style={styles.modalSubtitle}>
                  Find your perfect itinerary
                </Text>
              </View>

              <View style={styles.modalHeaderActions}>
                <Pressable
                  style={styles.modalResetBtn}
                  onPress={handleResetModalFilters}
                >
                  <Text style={styles.modalResetText}>Reset</Text>
                </Pressable>

                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setIsFilterModalVisible(false)}
                >
                  <Ionicons name="close" size={22} color={COLORS.textPrimary} />
                </Pressable>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollBody}
            >
              {/* Category Filter */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Category</Text>
                <View style={styles.optionsWrap}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = stagedCategory === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        style={[
                          styles.optionPill,
                          isSelected && styles.optionPillActive,
                        ]}
                        onPress={() => setStagedCategory(cat.id)}
                      >
                        <Ionicons
                          name={cat.icon}
                          size={15}
                          color={
                            isSelected ? COLORS.white : COLORS.textSecondary
                          }
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Sort By Filter */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Sort By</Text>
                <View style={styles.optionsWrap}>
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = stagedSortBy === opt.id;
                    return (
                      <Pressable
                        key={opt.id}
                        style={[
                          styles.optionPill,
                          isSelected && styles.optionPillActive,
                        ]}
                        onPress={() => setStagedSortBy(opt.id)}
                      >
                        <Ionicons
                          name={opt.icon}
                          size={15}
                          color={
                            isSelected ? COLORS.white : COLORS.textSecondary
                          }
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Price Range</Text>
                <View style={styles.optionsWrap}>
                  {PRICE_RANGES.map((rng) => {
                    const isSelected = stagedPriceRange === rng.id;
                    return (
                      <Pressable
                        key={rng.id}
                        style={[
                          styles.optionPill,
                          isSelected && styles.optionPillActive,
                        ]}
                        onPress={() => setStagedPriceRange(rng.id)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextActive,
                          ]}
                        >
                          {rng.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Rating */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Minimum Rating</Text>
                <View style={styles.optionsWrap}>
                  {RATING_OPTIONS.map((rate) => {
                    const isSelected = stagedMinRating === rate.id;
                    return (
                      <Pressable
                        key={rate.id}
                        style={[
                          styles.optionPill,
                          isSelected && styles.optionPillActive,
                        ]}
                        onPress={() => setStagedMinRating(rate.id)}
                      >
                        <Ionicons
                          name="star"
                          size={14}
                          color={isSelected ? COLORS.white : "#FFB800"}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.optionPillText,
                            isSelected && styles.optionPillTextActive,
                          ]}
                        >
                          {rate.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={styles.modalApplyBtn}
                onPress={handleApplyFilters}
              >
                <Text style={styles.modalApplyBtnText}>
                  {`Apply Filters (${stagedMatchingCount} ${
                    stagedMatchingCount === 1 ? "tour" : "tours"
                  })`}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 20,
  },

  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    marginLeft: 9,
  },

  locationLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  locationValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },

  profileCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  search: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 120,
    overflow: "hidden",
    paddingLeft: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 11,
    fontSize: 14,
    color: COLORS.textPrimary,
    outlineStyle: "none",
  },

  clearSearchBtn: {
    width: 40,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  filterBtn: {
    width: 55,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    position: "relative",
  },

  filterBtnActive: {
    backgroundColor: COLORS.primaryLight || "#EBF4FF",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },

  filterBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  filterBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "700",
  },

  sectionHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize:16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  
  },

  seeAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  footerSections: {
    marginTop: 10,
    paddingBottom: 20,
  },

  // Featured Destinations
  destinationsSection: {
    marginBottom: 26,
  },

  sliderList: {
    marginHorizontal: -16,
  },

  destinationsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },

  sliderArrowGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sliderArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  destinationCard: {
    width: 170,
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  destinationCardContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 12,
    zIndex: 2,
  },

  destinationImage: {
    ...StyleSheet.absoluteFillObject,
  },

  destinationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    zIndex: 1,
  },

  destinationTopBadges: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },

  ratingBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
  },

  tourCountBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  tourCountBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },

  destinationBottomInfo: {
  },

  destinationCountry: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
  },

  destinationName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  // 4. Offers
  offersSection: {
    marginBottom: 26,
  },

  offersContent: {
    paddingHorizontal: 16,
    gap: 14,
  },

  offerCard: {
    width: 275,
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  offerCardContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 14,
    zIndex: 2,
  },

  offerImage: {
    ...StyleSheet.absoluteFillObject,
  },

  offerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.52)",
    zIndex: 1,
  },

  offerBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  offerBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  offerContent: {
  },

  offerDiscount: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.3,
  },

  offerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 2,
  },

  offerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },

  offerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },

  offerCodePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },

  offerCodeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  claimText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  // Empty State
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primaryLight || "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },

  emptyResetBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  emptyResetBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    flex: 1,
  },

  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: "82%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8D8D8",
    alignSelf: "center",
    marginBottom: 14,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  modalHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  modalResetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  modalResetText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  modalScrollBody: {
    paddingBottom: 12,
  },

  modalSection: {
    marginBottom: 20,
  },

  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },

  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
  },

  optionPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionPillText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },

  optionPillTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },

  modalFooter: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  modalApplyBtn: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },

  modalApplyBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },
});
