import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import {
  X,
  Heart,
  MapPin,
  Star,
  Clock,
  Users,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";

export default function TourDetailModal({
  visible,
  tour,
  onClose,
  isWishlisted,
  onToggleWishlist,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'itinerary' | 'included'

  if (!tour) return null;

  const handleBookNow = () => {
    Alert.alert(
      "Booking Inquiry Sent! 🎉",
      `Your reservation request for "${tour.title}" has been placed. A Tourvaa travel specialist will contact you shortly.`,
      [{ text: "Great, thanks!" }]
    );
  };

  const itineraryDays = [
    {
      day: "Day 1",
      title: "Arrival & Welcome Briefing",
      description:
        "Arrive at the destination airport. Meet your private local guide and transfer to your hotel. Evening welcome dinner with local cuisine.",
    },
    {
      day: "Day 2",
      title: "Iconic Landmarks & Sightseeing",
      description:
        "Full day excursion exploring famous heritage sites, temples, scenic viewpoints, and guided photo stops with priority pass entry.",
    },
    {
      day: "Day 3",
      title: "Cultural Immersion & Hidden Gems",
      description:
        "Immerse yourself into authentic artisan workshops, traditional food tasting, local markets, and scenic countryside vistas.",
    },
    {
      day: "Day 4",
      title: "Adventure Activities & Leisure",
      description:
        "Guided nature hiking, catamaran excursion, or leisure time for exploring and boutique shopping at your own pace.",
    },
    {
      day: `Day ${tour.duration?.split(" ")?.[0] || "5"}`,
      title: "Farewell & Airport Transfer",
      description:
        "Relaxed breakfast overlooking scenic vistas, followed by private airport departure transfer.",
    },
  ];

  const highlights = [
    "Expert licensed English-speaking local guide throughout",
    "All entrance tickets, national park fees & permits included",
    "Air-conditioned private transportation",
    "Gourmet culinary lunches & welcome dinner",
    "Small group experience with skip-the-line privileges",
  ];

  const includedItems = [
    "Handpicked 4 & 5-star hotel accommodations",
    "Daily artisan breakfasts & scheduled meals",
    "Airport transfers upon arrival and departure",
    "All scheduled sightseeing & admissions",
    "24/7 dedicated Tourvaa concierge support",
  ];

  const excludedItems = [
    "International flights & visa fees",
    "Personal travel insurance",
    "Guide and driver gratuities",
    "Personal shopping & optional activities",
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* SCROLLABLE BODY */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO IMAGE */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: tour.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradient} />

            {/* Top Floating Actions */}
            <SafeAreaView style={styles.heroHeaderActions}>
              <Pressable style={styles.floatingActionBtn} onPress={onClose}>
                <X size={20} color={COLORS.textPrimary} />
              </Pressable>

              <Pressable
                style={styles.floatingActionBtn}
                onPress={() => onToggleWishlist?.(tour)}
              >
                <Heart
                  size={20}
                  color={isWishlisted ? COLORS.danger : COLORS.textPrimary}
                  fill={isWishlisted ? COLORS.danger : "none"}
                />
              </Pressable>
            </SafeAreaView>

            {/* Category Tag on Image */}
            {tour.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{tour.category}</Text>
              </View>
            )}
          </View>

          {/* TOUR HEADER DETAILS */}
          <View style={styles.mainInfo}>
            {/* Location */}
            <View style={styles.locationRow}>
              <MapPin
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.locationText}>{tour.location}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{tour.title}</Text>

            {/* Ratings Row */}
            <View style={styles.ratingRow}>
              <View style={styles.starsWrap}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    color="#FFB800"
                    fill="#FFB800"
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <Text style={styles.ratingScore}>{tour.rating}</Text>
              <Text style={styles.reviewsCount}>
                ({tour.reviewsCount || "3,692 reviews"})
              </Text>
            </View>

            {/* MINIMAL SPECS STRIP */}
            <View style={styles.specsStrip}>
              <View style={styles.specColumn}>
                <Clock size={16} color="#111827" />
                <Text style={styles.specValue}>{tour.duration || "5 Days"}</Text>
                <Text style={styles.specLabel}>Duration</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specColumn}>
                <Users size={16} color="#111827" />
                <Text style={styles.specValue}>Max {tour.groupSize || "20"}</Text>
                <Text style={styles.specLabel}>Group</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specColumn}>
                <User size={16} color="#111827" />
                <Text style={styles.specValue}>{tour.ageRange || "12–70"}</Text>
                <Text style={styles.specLabel}>Age</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specColumn}>
                <MessageSquare size={16} color="#111827" />
                <Text style={styles.specValue}>English</Text>
                <Text style={styles.specLabel}>Guide</Text>
              </View>
            </View>

            {/* TAB SELECTOR */}
            <View style={styles.tabBar}>
              <Pressable
                style={[
                  styles.tabItem,
                  activeTab === "overview" && styles.tabItemActive,
                ]}
                onPress={() => setActiveTab("overview")}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    activeTab === "overview" && styles.tabItemTextActive,
                  ]}
                >
                  Overview
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tabItem,
                  activeTab === "itinerary" && styles.tabItemActive,
                ]}
                onPress={() => setActiveTab("itinerary")}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    activeTab === "itinerary" && styles.tabItemTextActive,
                  ]}
                >
                  Itinerary
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tabItem,
                  activeTab === "included" && styles.tabItemActive,
                ]}
                onPress={() => setActiveTab("included")}
              >
                <Text
                  style={[
                    styles.tabItemText,
                    activeTab === "included" && styles.tabItemTextActive,
                  ]}
                >
                  Included
                </Text>
              </Pressable>
            </View>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <View style={styles.tabContent}>
                <Text style={styles.sectionHeading}>About This Tour</Text>
                <Text style={styles.descriptionText}>
                  {tour.description ||
                    "Embark on an extraordinary travel journey filled with breathtaking landscapes, cultural encounters, and memorable adventures curated by our award-winning travel experts."}
                </Text>

                <Text style={[styles.sectionHeading, { marginTop: 18 }]}>
                  Highlights
                </Text>
                <View style={styles.highlightsWrap}>
                  {highlights.map((item, index) => (
                    <View key={index} style={styles.highlightRow}>
                      <CheckCircle2
                        size={16}
                        color={COLORS.success}
                        style={{ marginTop: 2 }}
                      />
                      <Text style={styles.highlightText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* TAB 2: ITINERARY */}
            {activeTab === "itinerary" && (
              <View style={styles.tabContent}>
                <Text style={styles.sectionHeading}>Day-by-Day Plan</Text>
                <View style={styles.itineraryList}>
                  {itineraryDays.map((item, idx) => (
                    <View key={idx} style={styles.itineraryItem}>
                      <View style={styles.timelineCol}>
                        <View style={styles.timelineDot} />
                        {idx < itineraryDays.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>
                      <View style={styles.itineraryContent}>
                        <View style={styles.itineraryDayBadge}>
                          <Text style={styles.itineraryDayText}>{item.day}</Text>
                        </View>
                        <Text style={styles.itineraryTitle}>{item.title}</Text>
                        <Text style={styles.itineraryDesc}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* TAB 3: WHAT'S INCLUDED */}
            {activeTab === "included" && (
              <View style={styles.tabContent}>
                <Text style={styles.sectionHeading}>Included</Text>
                <View style={styles.inclusionList}>
                  {includedItems.map((inc, i) => (
                    <View key={i} style={styles.inclusionRow}>
                      <CheckCircle2
                        size={17}
                        color={COLORS.success}
                      />
                      <Text style={styles.inclusionText}>{inc}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.sectionHeading, { marginTop: 18 }]}>
                  Not Included
                </Text>
                <View style={styles.inclusionList}>
                  {excludedItems.map((exc, i) => (
                    <View key={i} style={styles.inclusionRow}>
                      <XCircle
                        size={17}
                        color={COLORS.muted}
                      />
                      <Text
                        style={[styles.inclusionText, { color: COLORS.textSecondary }]}
                      >
                        {exc}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* STICKY BOTTOM BOOKING BAR */}
        <SafeAreaView edges={["bottom"]} style={styles.bottomBar}>
          <View style={styles.bottomPriceCol}>
            <Text style={styles.bottomFromLabel}>From</Text>
            <Text style={styles.bottomPrice}>
              {tour.price}
              <Text style={styles.bottomPricePeriod}> pp</Text>
            </Text>
          </View>

          <Pressable style={styles.bookNowBtn} onPress={handleBookNow}>
            <Text style={styles.bookNowText}>Book Now</Text>
            <ArrowRight size={16} color={COLORS.white} />
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  heroContainer: {
    height: 230,
    position: "relative",
    backgroundColor: "#000",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  heroHeaderActions: {
    position: "absolute",
    top: 10,
    left: 14,
    right: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  floatingActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },

  categoryBadge: {
    position: "absolute",
    bottom: 12,
    left: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  categoryBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  mainInfo: {
    padding: 16,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 4,
  },

  locationText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 24,
    marginBottom: 6,
    letterSpacing: -0.3,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  starsWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingScore: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginLeft: 5,
  },

  reviewsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },

  // Minimal Specs Strip
  specsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 9,
    paddingHorizontal: 6,
    marginBottom: 16,
  },

  specColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  specValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 3,
    textAlign: "center",
  },

  specLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 1,
    textAlign: "center",
  },

  specDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#E2E8F0",
  },

  // Tab Bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },

  tabItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  tabItemActive: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  tabItemText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  tabItemTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  tabContent: {
    marginTop: 2,
  },

  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  descriptionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },

  highlightsWrap: {
    gap: 8,
  },

  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  highlightText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    flex: 1,
  },

  itineraryList: {
    paddingTop: 4,
  },

  itineraryItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  timelineCol: {
    alignItems: "center",
    width: 16,
  },

  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },

  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: "#E2E8F0",
    marginVertical: 3,
  },

  itineraryContent: {
    flex: 1,
    paddingBottom: 4,
  },

  itineraryDayBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 3,
  },

  itineraryDayText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },

  itineraryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  itineraryDesc: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 17,
  },

  inclusionList: {
    gap: 8,
  },

  inclusionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  inclusionText: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
    fontWeight: "500",
  },

  // Sticky Bottom Booking Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#EBF0F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },

  bottomPriceCol: {
    justifyContent: "center",
  },

  bottomFromLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  bottomPrice: {
    fontSize: 19,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },

  bottomPricePeriod: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  bookNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 14,
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  bookNowText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
