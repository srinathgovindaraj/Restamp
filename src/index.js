import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import App from "./App";

import { registerRootComponent } from "expo";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

// ======================================================
// TOUR DATA
// ======================================================

const tours = [
  {
    id: 1,
    title: "Bali Paradise Escape",
    price: "$1,250",
    location: "Bali, Indonesia",
    duration: "5 Days",
    guests: "2 Guests",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: 2,
    title: "Swiss Alps Adventure",
    price: "$2,450",
    location: "Interlaken, Switzerland",
    duration: "7 Days",
    guests: "2 Guests",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: 3,
    title: "Dubai Luxury Tour",
    price: "$1,800",
    location: "Dubai, UAE",
    duration: "4 Days",
    guests: "2 Guests",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
];

// ======================================================
// TOUR CARD
// ======================================================

function TourCard({ tour }) {
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        console.log("Tour selected:", tour.title);
      }}
    >
      {/* IMAGE */}

      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: tour.image,
          }}
          style={styles.tourImage}
          resizeMode="cover"
        />

        {/* AVAILABLE BADGE */}

        <View style={styles.availableBadge}>
          <View style={styles.greenDot} />

          <Text style={styles.availableText}>Available</Text>
        </View>

        {/* HEART */}

        <Pressable style={styles.heartButton} onPress={() => setLiked(!liked)}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>

        {/* BOTTOM DETAILS CARD */}

        <View style={styles.detailsCard}>
          <View style={styles.titlePriceRow}>
            <Text style={styles.tourTitle} numberOfLines={1}>
              {tour.title}
            </Text>

            <Text style={styles.price}>{tour.price}</Text>
          </View>

          {/* LOCATION */}

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#707070" />

            <Text numberOfLines={1} style={styles.locationText}>
              {tour.location}
            </Text>
          </View>

          {/* DETAILS */}

          <View style={styles.featuresRow}>
            <View style={styles.feature}>
              <Ionicons name="calendar-outline" size={16} color="#222222" />

              <Text style={styles.featureText}>{tour.duration}</Text>
            </View>

            <View style={styles.feature}>
              <Ionicons name="people-outline" size={16} color="#222222" />

              <Text style={styles.featureText}>{tour.guests}</Text>
            </View>

            <View style={styles.feature}>
              <Ionicons name="star-outline" size={16} color="#222222" />

              <Text style={styles.featureText}>{tour.rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ======================================================
// BOTTOM NAVIGATION
// ======================================================

function BottomNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    {
      name: "Home",
      icon: "home-outline",
      activeIcon: "home",
    },

    {
      name: "Wishlist",
      icon: "heart-outline",
      activeIcon: "heart",
    },

    {
      name: "Explore",
      icon: "compass-outline",
      activeIcon: "compass",
    },

    {
      name: "Message",
      icon: "chatbubble-outline",
      activeIcon: "chatbubble",
    },

    {
      name: "Account",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const active = activeTab === tab.name;

        return (
          <Pressable
            key={tab.name}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.name)}
          >
            <Ionicons
              name={active ? tab.activeIcon : tab.icon}
              size={22}
              color={active ? "#0075FF" : "#9A9A9A"}
            />

            <Text style={[styles.navText, active && styles.activeNavText]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ======================================================
// HOME SCREEN
// ======================================================

function HomeScreen() {
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("Home");

  const filteredTours = tours.filter(
    (tour) =>
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationIconWrapper}>
              <Ionicons name="location-outline" size={22} color="#111111" />
            </View>

            <View>
              <Text style={styles.locationLabel}>Location</Text>

              <Text style={styles.currentLocation}>Chennai, India</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* NOTIFICATION */}

            <Pressable style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111111"
              />

              <View style={styles.notificationDot} />
            </Pressable>

            {/* PROFILE */}

            <Pressable style={styles.profile}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                }}
                style={styles.profileImage}
              />
            </Pressable>
          </View>
        </View>

        {/* ================= SEARCH ================= */}

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={22} color="#333333" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Start your search"
            placeholderTextColor="#969696"
            style={styles.searchInput}
          />

          <View style={styles.searchDivider} />

          <Pressable style={styles.filterButton}>
            <Ionicons name="options-outline" size={22} color="#111111" />
          </Pressable>
        </View>

        {/* ================= CONTENT ================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "Home" ? (
            <>
              {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}

              {filteredTours.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={50} color="#CCCCCC" />

                  <Text style={styles.emptyTitle}>No tours found</Text>

                  <Text style={styles.emptySubtitle}>
                    Try another destination
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.tabScreen}>
              <Ionicons
                name={
                  activeTab === "Wishlist"
                    ? "heart-outline"
                    : activeTab === "Explore"
                      ? "compass-outline"
                      : activeTab === "Message"
                        ? "chatbubble-outline"
                        : "person-outline"
                }
                size={55}
                color="#0075FF"
              />

              <Text style={styles.tabScreenTitle}>{activeTab}</Text>

              <Text style={styles.tabScreenSubtitle}>
                Tourvaa {activeTab} screen
              </Text>
            </View>
          )}
        </ScrollView>

        {/* ================= BOTTOM NAVIGATION ================= */}

        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",

    width: "100%",
    maxWidth: 500,

    alignSelf: "center",

    ...(Platform.OS === "web"
      ? {
          minHeight: "100vh",
        }
      : {}),
  },

  // ==========================
  // HEADER
  // ==========================

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 18,

    paddingTop: 10,
    paddingBottom: 18,

    backgroundColor: "#FFFFFF",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIconWrapper: {
    width: 35,

    alignItems: "flex-start",

    justifyContent: "center",
  },

  locationLabel: {
    fontSize: 11,

    color: "#777777",

    marginBottom: 3,
  },

  currentLocation: {
    fontSize: 14,

    fontWeight: "600",

    color: "#111111",
  },

  headerRight: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,
  },

  notificationButton: {
    width: 40,
    height: 40,

    alignItems: "center",

    justifyContent: "center",

    position: "relative",
  },

  notificationDot: {
    position: "absolute",

    right: 8,
    top: 8,

    width: 6,
    height: 6,

    borderRadius: 10,

    backgroundColor: "#0075FF",

    borderWidth: 1,

    borderColor: "#FFFFFF",
  },

  profile: {
    width: 42,
    height: 42,

    borderRadius: 21,

    overflow: "hidden",

    backgroundColor: "#EEEEEE",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  // ==========================
  // SEARCH
  // ==========================

  searchContainer: {
    height: 56,

    flexDirection: "row",

    alignItems: "center",

    marginHorizontal: 18,

    marginBottom: 14,

    backgroundColor: "#F9F9F9",

    borderRadius: 14,

    paddingLeft: 15,
  },

  searchInput: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 10,

    fontSize: 14,

    color: "#111111",

    outlineStyle: "none",
  },

  searchDivider: {
    height: 27,

    width: 1,

    backgroundColor: "#E7E7E7",
  },

  filterButton: {
    width: 55,
    height: 55,

    alignItems: "center",

    justifyContent: "center",
  },

  // ==========================
  // SCROLL
  // ==========================

  scrollContent: {
    paddingHorizontal: 15,

    paddingTop: 4,

    paddingBottom: 110,
  },

  // ==========================
  // CARD
  // ==========================

  card: {
    marginBottom: 16,

    borderRadius: 20,

    overflow: "hidden",

    backgroundColor: "#FFFFFF",
  },

  imageWrapper: {
    height: 320,

    borderRadius: 20,

    overflow: "hidden",

    position: "relative",

    backgroundColor: "#EEEEEE",
  },

  tourImage: {
    width: "100%",
    height: "100%",
  },

  availableBadge: {
    position: "absolute",

    top: 13,
    left: 13,

    height: 35,

    paddingHorizontal: 13,

    borderRadius: 20,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.75)",
  },

  greenDot: {
    width: 10,
    height: 10,

    borderRadius: 10,

    backgroundColor: "#21C978",

    marginRight: 7,

    borderWidth: 2,

    borderColor: "#FFFFFF",
  },

  availableText: {
    fontSize: 13,

    fontWeight: "500",

    color: "#222222",
  },

  heartButton: {
    position: "absolute",

    right: 13,
    top: 12,

    width: 42,
    height: 42,

    borderRadius: 22,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.22)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.65)",
  },

  // ==========================
  // DETAILS
  // ==========================

  detailsCard: {
    position: "absolute",

    left: 9,
    right: 9,
    bottom: 9,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    paddingHorizontal: 14,

    paddingVertical: 13,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.12,

    shadowRadius: 6,

    elevation: 4,
  },

  titlePriceRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  tourTitle: {
    flex: 1,

    paddingRight: 10,

    fontSize: 16,

    fontWeight: "700",

    color: "#181818",
  },

  price: {
    fontSize: 15,

    fontWeight: "700",

    color: "#111111",
  },

  locationRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 8,
  },

  locationText: {
    flex: 1,

    marginLeft: 4,

    fontSize: 14,

    color: "#707070",
  },

  featuresRow: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 10,

    gap: 17,
  },

  feature: {
    flexDirection: "row",

    alignItems: "center",
  },

  featureText: {
    marginLeft: 4,

    fontSize: 14,

    color: "#333333",
  },

  // ==========================
  // EMPTY SEARCH
  // ==========================

  emptyContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingTop: 100,
  },

  emptyTitle: {
    marginTop: 16,

    fontSize: 18,

    fontWeight: "700",

    color: "#222222",
  },

  emptySubtitle: {
    marginTop: 5,

    fontSize: 13,

    color: "#888888",
  },

  // ==========================
  // OTHER TAB
  // ==========================

  tabScreen: {
    minHeight: 550,

    alignItems: "center",

    justifyContent: "center",
  },

  tabScreenTitle: {
    marginTop: 15,

    fontSize: 25,

    fontWeight: "700",

    color: "#111111",
  },

  tabScreenSubtitle: {
    marginTop: 6,

    fontSize: 14,

    color: "#888888",
  },

  // ==========================
  // BOTTOM NAVIGATION
  // ==========================

  bottomNav: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    height: Platform.OS === "web" ? 75 : 82,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-around",

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,

    borderTopColor: "#EFEFEF",

    paddingBottom: Platform.OS === "web" ? 5 : 10,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: -2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 5,

    elevation: 10,
  },

  navItem: {
    flex: 1,

    height: "100%",

    alignItems: "center",

    justifyContent: "center",

    gap: 4,
  },

  navText: {
    fontSize: 10,

    color: "#999999",

    fontWeight: "500",
  },

  activeNavText: {
    color: "#0075FF",

    fontWeight: "600",
  },
});

// ======================================================
// START APP
// ======================================================

registerRootComponent(App);
