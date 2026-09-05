import React, { useState } from "react";

import { View, Text, Image, StyleSheet, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import COLORS from "../constants/colors";

export default function TourCard({
  tour,
  isWishlisted: isWishlistedProp,
  onToggleWishlist,
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

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        console.log("Tour:", tour.id);
      }}
    >
      {/* ================= IMAGE ================= */}

      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: tour.image,
          }}
          style={styles.image}
        />

        {/* ================= AVAILABLE ================= */}

        <View style={styles.status}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>Available</Text>
        </View>

        {/* ================= WISHLIST ================= */}

        <Pressable
          style={[
            styles.wishlist,
            isWishlisted && styles.wishlistActive,
          ]}
          onPress={handleWishlistPress}
          hitSlop={8}
        >
          <View style={styles.wishlistIconBox}>
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={20}
              color={isWishlisted ? COLORS.danger : (COLORS.heart || COLORS.white)}
            />
          </View>
        </Pressable>
      </View>

      {/* ================= DETAILS ================= */}

      <View style={styles.content}>
        {/* TITLE + PRICE */}

        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {tour.title}
          </Text>

          <Text style={styles.price}>{tour.price}</Text>
        </View>

        {/* ================= LOCATION ================= */}

        <View style={styles.locationRow}>
          <View style={styles.locationIconBox}>
            <Ionicons
              name="location-outline"
              size={14}
              color={COLORS.textSecondary}
            />
          </View>

          <Text style={styles.location}>{tour.location}</Text>
        </View>

        {/* ================= INFO ================= */}

        <View style={styles.infoRow}>
          {/* DURATION */}

          <View style={styles.info}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="time-outline"
                size={14}
                color={COLORS.textPrimary}
              />
            </View>

            <Text style={styles.infoText}>{tour.duration}</Text>
          </View>

          {/* RATING */}

          <View style={styles.info}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="star-outline"
                size={14}
                color={COLORS.textPrimary}
              />
            </View>

            <Text style={styles.infoText}>{tour.rating}</Text>
          </View>

          {/* PEOPLE */}

          <View style={styles.info}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="people-outline"
                size={14}
                color={COLORS.textPrimary}
              />
            </View>

            <Text style={styles.infoText}>{tour.people}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ================= CARD =================

  card: {
    backgroundColor: COLORS.white,

    borderRadius: 20,

    marginBottom: 18,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ================= IMAGE =================

  imageContainer: {
    height: 212,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  // ================= STATUS =================

  status: {
    position: "absolute",

    top: 14,
    left: 14,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.90)",

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 20,
  },

  statusDot: {
    width: 9,
    height: 9,

    borderRadius: 50,

    backgroundColor: COLORS.success,

    marginRight: 7,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "500",

    color: COLORS.textPrimary,
  },

  // ================= WISHLIST =================

  wishlist: {
    position: "absolute",

    right: 14,
    top: 14,

    width: 40,
    height: 40,

    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  wishlistActive: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },

  // manually control heart icon area
  wishlistIconBox: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",
  },

  // ================= CONTENT =================

  content: {
    padding: 16,
  },

  // ================= TITLE =================

  titleRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  title: {
    flex: 1,

    marginRight: 10,

    fontSize: 17,
    fontWeight: "700",

    color: COLORS.textPrimary,
  },

  price: {
    fontSize: 17,
    fontWeight: "700",

    color: COLORS.primary,
  },

  // ================= LOCATION =================

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 10,
  },

  // manually control location icon width / height
  locationIconBox: {
    width: 14,
    height: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  location: {
    marginLeft: 5,

    color: COLORS.textSecondary,

    fontSize: 12,
  },

  // ================= INFO ROW =================

  infoRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 14,

    gap: 16,
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
  },

  // manually control info icon width / height
  infoIconBox: {
    width: 14,
    height: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    marginLeft: 5,

    fontSize: 12,

    color: COLORS.textPrimary,
  },
});
