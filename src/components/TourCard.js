import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function TourCard({
  tour,
  isWishlisted: isWishlistedProp,
  onToggleWishlist,
  onPress,
}) {
  const [internalWishlisted, setInternalWishlisted] = useState(false);
  const isWishlisted =
    isWishlistedProp !== undefined ? isWishlistedProp : internalWishlisted;

  const handleWishlistPress = (e) => {
    e?.stopPropagation?.();
    if (onToggleWishlist) {
      onToggleWishlist(tour);
    } else {
      setInternalWishlisted((prev) => !prev);
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(tour);
    } else {
      console.log("Tour clicked:", tour.id, tour.title);
    }
  };

  // Format currency & prices
  const formatPriceValue = (val) => {
    if (!val) return "";
    const str = String(val);
    const symbol = str.startsWith("₹") ? "₹" : str.startsWith("$") ? "$" : "$";
    const numOnly = parseFloat(str.replace(/[^0-9.]/g, ""));
    if (isNaN(numOnly)) return str;
    return `${symbol}${numOnly.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const displayPrice = formatPriceValue(tour.price);
  const displayOriginalPrice = tour.originalPrice
    ? formatPriceValue(tour.originalPrice)
    : formatPriceValue(
        parseFloat(String(tour.price).replace(/[^0-9.]/g, "") || "0") * 1.16
      );

  return (
    <Pressable style={styles.card} onPress={handleCardPress}>
      {/* 1. TOP IMAGE WITH BADGES */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: tour.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Location Badge */}
        {tour.location && (
          <View style={styles.locationBadge}>
            <Feather
              name="map-pin"
              size={12}
              color={COLORS.white}
              strokeWidth={2.5}
              style={styles.locationBadgeIcon}
            />
            <Text style={styles.locationBadgeText} numberOfLines={1}>
              {tour.location}
            </Text>
          </View>
        )}

        {/* Wishlist Heart Button */}
        <Pressable
          style={styles.wishlistBtn}
          onPress={handleWishlistPress}
          hitSlop={8}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart"}
            size={16}
            color={isWishlisted ? COLORS.danger : "#D0D5DD"}
          />
        </Pressable>
      </View>

      {/* 2. CARD DETAILS CONTENT */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {tour.title}
        </Text>

        {/* Ratings Row: 5 Stars + Rating score + Review count */}
        <View style={styles.ratingRow}>
          <View style={styles.starsWrap}>
            {[1, 2, 3, 4, 5].map((starIndex) => (
              <Ionicons
                key={starIndex}
                name="star"
                size={13}
                color="#FFB800"
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={styles.ratingScore}>{tour.rating}</Text>
          <Text style={styles.reviewCount}>
            {tour.reviewsCount || "3,692 reviews"}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Specifications 2x2 Grid with Feather Outline Icons */}
        <View style={styles.specsGrid}>
          {/* Row 1: Duration & Location */}
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Feather name="clock" size={13} color="#666769ff" strokeWidth={3} />
              <Text style={styles.specText} numberOfLines={1}>
                {tour.duration || "1 Day"}
              </Text>
            </View>

            <View style={styles.specDividerLine} />

            <View style={styles.specItem}>
              <Feather name="map-pin" size={13} color="#666769ff" strokeWidth={3} />
              <Text style={styles.specText} numberOfLines={1}>
                {tour.location}
              </Text>
            </View>
          </View>

          {/* Row 2: Age Range & Group Size */}
          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Feather name="user" size={13} color="#666769ff" strokeWidth={3} />
              <Text style={styles.specText} numberOfLines={1}>
                Age: {tour.ageRange || "12–70"}
              </Text>
            </View>

            <View style={styles.specDividerLine} />

            <View style={styles.specItem}>
              <Feather name="users" size={13} color="#666769ff" strokeWidth={3} />
              <Text style={styles.specText} numberOfLines={1}>
                Max: {tour.groupSize || "20"}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <Text style={styles.fromLabel}>From </Text>
            <Text style={styles.originalPrice}>{displayOriginalPrice}pp</Text>
          </View>

          <View style={styles.priceRight}>
            <Text style={styles.currentPrice}>
              {displayPrice}
              <Text style={styles.ppSuffix}> pp</Text>
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAECEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // Image Section
  imageContainer: {
    height: 140,
    position: "relative",
    backgroundColor: "#F0F2F5",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  locationBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(84, 84, 84, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(151, 151, 151, 0.45)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  locationBadgeIcon: {
    marginRight: 4,
  },

  locationBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
  },

  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  // Content Details Section
  content: {
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111727",
    lineHeight: 21,
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  // Rating Row
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  starsWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  starIcon: {
    marginRight: 1.5,
  },

  ratingScore: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111727",
    marginLeft: 5,
  },

  reviewCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7E8B9B",
    marginLeft: 4,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#F1F3F5",
    marginVertical: 8,
  },

  // Specifications 2x2 Grid
  specsGrid: {
    gap: 6,
  },

  specsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  specItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  specDividerLine: {
    width: 1,
    height: 12,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },

  specText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#757575ff",
    flex: 1,
  },

  // Price Row
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },

  priceLeft: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },

  fromLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111727",
  },

  originalPrice: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8A94A0",
    textDecorationLine: "line-through",
  },

  priceRight: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  currentPrice: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0F141A",
    letterSpacing: -0.2,
  },

  ppSuffix: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7b8eff",
  },
});
