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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import toursData from "../data/tours";
import { useWishlist } from "../context/WishlistContext";

export default function ExploreScreen() {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'rating' | 'price'

  const categories = [
    { id: "All", label: "All", icon: "compass-outline" },
    { id: "Beach", label: "Beach", icon: "sunny-outline" },
    { id: "Mountain", label: "Mountain", icon: "triangle-outline" },
    { id: "Culture", label: "Culture", icon: "color-palette-outline" },
    { id: "City", label: "City", icon: "business-outline" },
    { id: "Adventure", label: "Adventure", icon: "trail-sign-outline" },
  ];

  const featuredTours = useMemo(() => {
    return toursData.filter((t) => t.featured);
  }, []);

  const filteredAndSortedTours = useMemo(() => {
    let result = toursData.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || tour.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "rating") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "price") {
      result.sort((a, b) => {
        const pA = parseInt(a.price.replace(/[^0-9]/g, ""), 10);
        const pB = parseInt(b.price.replace(/[^0-9]/g, ""), 10);
        return pA - pB;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover curated world travels</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by destination or title..."
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
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
                  <Ionicons
                    name={item.icon}
                    size={14}
                    color={active ? COLORS.white : COLORS.textSecondary}
                  />
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

        {/* Featured Section (when no search query) */}
        {!searchQuery && selectedCategory === "All" && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Journeys</Text>
              <Text style={styles.featuredCount}>Top Picks</Text>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredTours}
              keyExtractor={(item) => `feat-${item.id}`}
              contentContainerStyle={styles.featuredList}
              renderItem={({ item }) => {
                const saved = isWishlisted(item.id);
                return (
                  <Pressable
                    style={styles.featuredCard}
                    onPress={() =>
                      Alert.alert(item.title, `${item.description}\n\nPrice: ${item.price}`)
                    }
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
                      <Ionicons
                        name={saved ? "heart" : "heart-outline"}
                        size={16}
                        color={saved ? COLORS.danger : COLORS.white}
                      />
                    </Pressable>

                    <View style={styles.featuredInfo}>
                      <View style={styles.featuredRatingBadge}>
                        <Ionicons name="star" size={11} color={COLORS.star} />
                        <Text style={styles.featuredRatingText}>{item.rating}</Text>
                      </View>
                      <Text style={styles.featuredTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.featuredBottomRow}>
                        <Text style={styles.featuredLocation} numberOfLines={1}>
                          {item.location}
                        </Text>
                        <Text style={styles.featuredPrice}>{item.price}</Text>
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
            {filteredAndSortedTours.length} {filteredAndSortedTours.length === 1 ? "Tour" : "Tours"} Available
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
                ★ Top
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
                $ Low
              </Text>
            </Pressable>
          </View>
        </View>

        {/* All Destinations Grid / List */}
        {filteredAndSortedTours.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredAndSortedTours.map((item) => {
              const saved = isWishlisted(item.id);
              return (
                <Pressable
                  key={item.id}
                  style={styles.gridCard}
                  onPress={() =>
                    Alert.alert(
                      item.title,
                      `${item.description || item.location}\n\nPrice: ${item.price}\nDuration: ${item.duration}`
                    )
                  }
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
                      <Ionicons
                        name={saved ? "heart" : "heart-outline"}
                        size={14}
                        color={saved ? COLORS.danger : COLORS.white}
                      />
                    </Pressable>
                    <View style={styles.gridRating}>
                      <Ionicons name="star" size={10} color={COLORS.star} />
                      <Text style={styles.gridRatingText}>{item.rating}</Text>
                    </View>
                  </View>

                  <View style={styles.gridDetails}>
                    <Text style={styles.gridTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.gridLocation} numberOfLines={1}>
                      {item.location}
                    </Text>

                    <View style={styles.gridPriceRow}>
                      <Text style={styles.gridDuration}>{item.duration}</Text>
                      <Text style={styles.gridPrice}>{item.price}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={36} color={COLORS.muted} />
            <Text style={styles.emptySearchTitle}>No destinations found</Text>
            <Text style={styles.emptySearchSub}>
              We couldn't find matches for "{searchQuery}". Try a different keyword.
            </Text>
          </View>
        )}
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
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
    fontSize: 12,
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
    fontSize: 17,
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
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  featuredHeartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  featuredHeartBtnActive: {
    backgroundColor: "rgba(255,255,255,0.92)",
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
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 4,
    marginBottom: 6,
  },
  featuredRatingText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },
  featuredTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  featuredBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  featuredLocation: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    flex: 1,
    marginRight: 6,
  },
  featuredPrice: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  sortBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  sortOptions: {
    flexDirection: "row",
    gap: 6,
  },
  sortPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#EEEEEE",
  },
  sortPillActive: {
    backgroundColor: COLORS.primaryLight,
  },
  sortPillText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  sortPillTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  gridContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  gridCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridHeartBtnActive: {
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  gridRating: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridRatingText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
  },
  gridDetails: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  gridLocation: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gridPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F4",
  },
  gridDuration: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  gridPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptySearch: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 40,
  },
  emptySearchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptySearchSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});