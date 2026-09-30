import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, XCircle, Heart, Star, MapPin } from "lucide-react-native";
import COLORS from "../../constants/colors";
import ALL_PROPERTIES, { RECOMMENDED_PROPERTIES } from "../../data/properties";
import { useWishlist } from "../../context/WishlistContext";
import PropertyDetailModal from "../../components/PropertyDetailModal";

export default function ExploreScreen() {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'rating' | 'price'
  const [selectedProperty, setSelectedProperty] = useState(null);

  const categories = [
    { id: "All", label: "All Properties" },
    { id: "Apartment", label: "Apartments" },
    { id: "Villa", label: "Villas" },
    { id: "House", label: "Houses" },
    { id: "Commercial", label: "Commercial" },
    { id: "Plot", label: "Plots" },
  ];

  const featuredProperties = useMemo(() => {
    return RECOMMENDED_PROPERTIES.slice(0, 6);
  }, []);

  const filteredAndSortedProperties = useMemo(() => {
    let result = ALL_PROPERTIES.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        property.type.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price") {
      result.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Properties</Text>
        <Text style={styles.headerSubtitle}>Discover verified properties across Chennai</Text>

        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location or property..."
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <XCircle size={18} color={COLORS.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Pills */}
        <View style={styles.categorySection}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => {
              const active = selectedCategory === item.id;
              return (
                <Pressable
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        {/* Featured Properties (when no search query) */}
        {!searchQuery && selectedCategory === "All" && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Properties</Text>
              <Text style={styles.featuredCount}>Top Picks</Text>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredProperties}
              keyExtractor={(item) => `feat-${item.id}`}
              contentContainerStyle={styles.featuredList}
              renderItem={({ item }) => {
                const saved = isWishlisted(item.id);
                return (
                  <Pressable
                    style={styles.featuredCard}
                    onPress={() => setSelectedProperty(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.featuredImage} />
                    <View style={styles.featuredOverlay} />

                    <Pressable
                      style={[styles.featuredHeartBtn, saved && styles.featuredHeartBtnActive]}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        toggleWishlist(item);
                      }}
                      hitSlop={8}
                    >
                      <Heart
                        size={16}
                        color={saved ? COLORS.danger : COLORS.white}
                        fill={saved ? COLORS.danger : "none"}
                      />
                    </Pressable>

                    <View style={styles.featuredInfo}>
                      <View style={styles.featuredRatingBadge}>
                        <Star size={11} color={COLORS.star} fill={COLORS.star} />
                        <Text style={styles.featuredRatingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.featuredTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.featuredBottomRow}>
                        <Text style={styles.featuredLocation} numberOfLines={1}>
                          {item.location}
                        </Text>
                        <Text style={styles.featuredPrice}>
                          {item.price}{item.pricePeriod}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
          </View>
        )}

        {/* Sort Filter Bar */}
        <View style={styles.sortBar}>
          <Text style={styles.resultsCount}>
            {filteredAndSortedProperties.length} {filteredAndSortedProperties.length === 1 ? "Property" : "Properties"} Available
          </Text>

          <View style={styles.sortOptions}>
            <Pressable
              style={[styles.sortPill, sortBy === "recommended" && styles.sortPillActive]}
              onPress={() => setSortBy("recommended")}
            >
              <Text
                style={[
                  styles.sortPillText,
                  sortBy === "recommended" && styles.sortPillTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              style={[styles.sortPill, sortBy === "rating" && styles.sortPillActive]}
              onPress={() => setSortBy("rating")}
            >
              <Text
                style={[
                  styles.sortPillText,
                  sortBy === "rating" && styles.sortPillTextActive,
                ]}
              >
                ★ Top Rated
              </Text>
            </Pressable>
            <Pressable
              style={[styles.sortPill, sortBy === "price" && styles.sortPillActive]}
              onPress={() => setSortBy("price")}
            >
              <Text
                style={[
                  styles.sortPillText,
                  sortBy === "price" && styles.sortPillTextActive,
                ]}
              >
                ₹ Price Low
              </Text>
            </Pressable>
          </View>
        </View>

        {/* All Properties Grid / List */}
        {filteredAndSortedProperties.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredAndSortedProperties.map((item) => {
              const saved = isWishlisted(item.id);
              return (
                <Pressable
                  key={item.id}
                  style={styles.gridCard}
                  onPress={() => setSelectedProperty(item)}
                >
                  <View style={styles.gridImageBox}>
                    <Image source={{ uri: item.image }} style={styles.gridImage} />
                    <Pressable
                      style={[styles.gridHeartBtn, saved && styles.gridHeartBtnActive]}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        toggleWishlist(item);
                      }}
                      hitSlop={8}
                    >
                      <Heart
                        size={14}
                        color={saved ? COLORS.danger : COLORS.white}
                        fill={saved ? COLORS.danger : "none"}
                      />
                    </Pressable>
                    <View style={styles.gridRating}>
                      <Star size={10} color={COLORS.star} fill={COLORS.star} />
                      <Text style={styles.gridRatingText}>{item.rating}</Text>
                    </View>
                  </View>

                  <View style={styles.gridDetails}>
                    <Text style={styles.gridTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.locationRow}>
                      <MapPin size={11} color={COLORS.textSecondary} />
                      <Text style={styles.gridLocation} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>

                    <View style={styles.gridPriceRow}>
                      <Text style={styles.gridArea}>{item.sqft} sqft</Text>
                      <Text style={styles.gridPrice}>
                        {item.price}{item.pricePeriod}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptySearch}>
            <Search size={36} color={COLORS.muted} />
            <Text style={styles.emptySearchTitle}>No properties found</Text>
            <Text style={styles.emptySearchSub}>
              We couldn't find matches for "{searchQuery}". Try a different location or keyword.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Property Detail Modal */}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12.5,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  featuredSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  featuredCount: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  featuredList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  featuredCard: {
    width: 240,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: COLORS.cardBg,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  featuredHeartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredHeartBtnActive: {
    backgroundColor: COLORS.white,
  },
  featuredInfo: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  featuredRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
    marginBottom: 4,
  },
  featuredRatingText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  featuredBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredLocation: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
    marginRight: 8,
  },
  featuredPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
  sortBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  sortOptions: {
    flexDirection: "row",
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortPillText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  sortPillTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  gridContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  gridImageBox: {
    height: 110,
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridHeartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  gridHeartBtnActive: {
    backgroundColor: COLORS.white,
  },
  gridRating: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  gridRatingText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.white,
  },
  gridDetails: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 12.5,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 2,
  },
  gridLocation: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    flex: 1,
  },
  gridPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridArea: {
    fontSize: 10.5,
    color: COLORS.muted,
  },
  gridPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptySearch: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptySearchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySearchSub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});