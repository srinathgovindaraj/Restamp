import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistScreen() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    restoreDefaultWishlist,
  } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Beach", "Mountain", "Culture", "City", "Adventure"];

  const filteredItems = wishlist.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const handleRemove = (id) => {
    removeFromWishlist(id);
  };

  const handleClearAll = () => {
    if (wishlist.length === 0) return;
    Alert.alert("Clear Wishlist", "Remove all saved tours from your wishlist?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearWishlist },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Pressable
          style={styles.heartBtn}
          onPress={() => handleRemove(item.id)}
          hitSlop={8}
        >
          <Ionicons name="heart" size={18} color={COLORS.danger} />
        </Pressable>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={13} color={COLORS.star} />
              <Text style={styles.metaText}>{item.rating}</Text>
            </View>
          </View>

          <Pressable
            style={styles.bookBtn}
            onPress={() => {
              Alert.alert("Tour Selected", `Ready to book ${item.title}?`);
            }}
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            {wishlist.length} saved {wishlist.length === 1 ? "destination" : "destinations"}
          </Text>
        </View>

        {wishlist.length > 0 && (
          <Pressable style={styles.clearBtn} onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      {/* Category Filter Chips */}
      {wishlist.length > 0 && (
        <View style={styles.categoriesWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(cat) => cat}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item: cat }) => {
              const active = selectedCategory === cat;
              return (
                <Pressable
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[styles.categoryChipText, active && styles.categoryChipTextActive]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      )}

      {/* Content List or Empty State */}
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={36} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>
            {wishlist.length === 0 ? "Your wishlist is empty" : "No tours in this category"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {wishlist.length === 0
              ? "Explore tours on the Home page and tap the heart icon to save your favorite destinations here."
              : "Try choosing another category or explore all saved destinations."}
          </Text>

          {wishlist.length === 0 ? (
            <Pressable style={styles.actionBtn} onPress={restoreDefaultWishlist}>
              <Ionicons name="sparkles-outline" size={16} color={COLORS.white} />
              <Text style={styles.actionBtnText}>Restore Sample Tours</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.actionBtn}
              onPress={() => setSelectedCategory("All")}
            >
              <Text style={styles.actionBtnText}>Show All Saved</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  clearText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  categoriesWrapper: {
    marginBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageBox: {
    height: 160,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    padding: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F4",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  bookBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  bookBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
    marginTop: 40,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
  actionBtn: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
});