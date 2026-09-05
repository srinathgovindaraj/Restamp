import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import COLORS from "../constants/colors";

import TourCard from "../components/TourCard";

import tours from "../data/tours";
import { useWishlist } from "../context/WishlistContext";

export default function HomeScreen() {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTours = tours.filter((tour) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      tour.title.toLowerCase().includes(query) ||
      tour.location.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredTours}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            {/* Location */}

            <View style={styles.header}>
              <View
                style={
                  styles.locationWrapper
                }
              >
                <Ionicons
                  name="location-outline"
                  size={23}
                  color={COLORS.primary}
                />

                <View style={styles.locationText}>
                  <Text
                    style={
                      styles.locationLabel
                    }
                  >
                    Location
                  </Text>

                  <Text
                    style={
                      styles.locationValue
                    }
                  >
                    Chennai, India
                  </Text>
                </View>
              </View>

              <View style={styles.headerRight}>
                <Pressable
                  style={
                    styles.headerIcon
                  }
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                  />
                </Pressable>

                <View
                  style={
                    styles.profileCircle
                  }
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={COLORS.white}
                  />
                </View>
              </View>
            </View>

            {/* Search */}

            <View style={styles.search}>
              <Ionicons
                name="search-outline"
                size={22}
                color={
                  COLORS.textSecondary
                }
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Search destination"
                placeholderTextColor="#9A9A9A"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {searchQuery.length > 0 ? (
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
              ) : (
                <Pressable
                  style={styles.filter}
                >
                  <Ionicons
                    name="options-outline"
                    size={22}
                    color={
                      COLORS.textPrimary
                    }
                  />
                </Pressable>
              )}
            </View>

            {/* Heading */}

            <View
              style={
                styles.sectionHeading
              }
            >
              <View>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Explore Tours
                </Text>

                <Text
                  style={
                    styles.sectionSubtitle
                  }
                >
                  Find your next adventure
                </Text>
              </View>

              <Pressable>
                <Text
                  style={styles.seeAll}
                >
                  See all
                </Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TourCard
            tour={item}
            isWishlisted={isWishlisted(item.id)}
            onToggleWishlist={() => toggleWishlist(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent:
      "space-between",

    marginTop: 8,
    marginBottom: 22,
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

    color:
      COLORS.textSecondary,
  },

  locationValue: {
    marginTop: 2,

    fontSize: 14,
    fontWeight: "600",

    color:
      COLORS.textPrimary,
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
  },

  profileCircle: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor:
      COLORS.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  search: {
    height: 56,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.white,

    borderRadius: 16,

    paddingLeft: 16,

    marginBottom: 26,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 11,

    fontSize: 14,
  },

  clearSearchBtn: {
    width: 50,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  filter: {
    width: 55,
    height: 56,

    alignItems: "center",
    justifyContent: "center",

    borderLeftWidth: 1,
    borderLeftColor:
      COLORS.border,
  },

  sectionHeading: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "flex-end",

    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",

    color: COLORS.textPrimary,
  },

  sectionSubtitle: {
    marginTop: 4,

    fontSize: 13,

    color:
      COLORS.textSecondary,
  },

  seeAll: {
    color: COLORS.primary,

    fontSize: 13,
    fontWeight: "600",
  },
});