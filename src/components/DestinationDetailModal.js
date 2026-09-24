import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import {
  X,
  Star,
  MapPin,
  Sun,
  Calendar,
  Banknote,
  MessageSquare,
  Compass,
  Sparkles,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import TourCard from "./TourCard";
import toursData from "../data/tours";

export default function DestinationDetailModal({
  visible,
  destination,
  onClose,
  onSelectTour,
  isWishlisted,
  onToggleWishlist,
}) {
  if (!destination) return null;

  // Filter tours related to this destination
  const relatedTours = toursData.filter((t) => {
    const destName = destination.name.toLowerCase();
    const tourLoc = t.location.toLowerCase();
    const tourTitle = t.title.toLowerCase();
    return (
      tourLoc.includes(destName) ||
      tourTitle.includes(destName) ||
      (destination.country &&
        tourLoc.includes(destination.country.toLowerCase()))
    );
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HERO IMAGE */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: destination.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradient} />

            {/* Top Floating Actions */}
            <SafeAreaView style={styles.heroHeaderActions}>
              <Pressable style={styles.floatingActionBtn} onPress={onClose}>
                <X size={20} color={COLORS.textPrimary} />
              </Pressable>

              <View style={styles.heroBadge}>
                <Star size={13} color="#FFB800" fill="#FFB800" />
                <Text style={styles.heroBadgeText}>{destination.rating}</Text>
              </View>
            </SafeAreaView>

            {/* Title & Country on Image */}
            <View style={styles.heroBottomInfo}>
              <View style={styles.countryPill}>
                <MapPin size={13} color={COLORS.white} />
                <Text style={styles.countryPillText}>{destination.country}</Text>
              </View>
              <Text style={styles.heroTitle}>{destination.name}</Text>
            </View>
          </View>

          {/* MAIN BODY */}
          <View style={styles.body}>
            {/* MINIMAL SPECS STRIP */}
            <View style={styles.specsStrip}>
              <View style={styles.specColumn}>
                <Sun size={16} color="#111827" />
                <Text style={styles.specValue}>{destination.weather || "24°C"}</Text>
                <Text style={styles.specLabel}>Weather</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specColumn}>
                <Calendar size={16} color="#111827" />
                <Text style={styles.specValue} numberOfLines={1}>
                  {destination.bestTime || "All Year"}
                </Text>
                <Text style={styles.specLabel}>Season</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specColumn}>
                <Banknote size={16} color="#111827" />
                <Text style={styles.specValue} numberOfLines={1}>
                  {destination.currency || "USD"}
                </Text>
                <Text style={styles.specLabel}>Currency</Text>
              </View>

              <View style={styles.specDivider} />

              <View style={styles.specColumn}>
                <MessageSquare size={16} color="#111827" />
                <Text style={styles.specValue} numberOfLines={1}>
                  {destination.language || "English"}
                </Text>
                <Text style={styles.specLabel}>Language</Text>
              </View>
            </View>

            {/* ABOUT DESTINATION */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About {destination.name}</Text>
              <Text style={styles.descriptionText}>
                {destination.description}
              </Text>
            </View>

            {/* TOP HIGHLIGHTS */}
            {destination.highlights && destination.highlights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Must-See Highlights</Text>
                <View style={styles.highlightsWrap}>
                  {destination.highlights.map((item, index) => (
                    <View key={index} style={styles.highlightChip}>
                      <Compass size={15} color={COLORS.primary} />
                      <Text style={styles.highlightText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* TOURS IN THIS DESTINATION */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Tours in {destination.name}
                </Text>
                <Text style={styles.sectionCount}>
                  {relatedTours.length} {relatedTours.length === 1 ? "tour" : "tours"}
                </Text>
              </View>

              {relatedTours.length > 0 ? (
                relatedTours.map((t) => (
                  <TourCard
                    key={t.id}
                    tour={t}
                    isWishlisted={isWishlisted?.(t.id)}
                    onToggleWishlist={() => onToggleWishlist?.(t)}
                    onPress={() => onSelectTour?.(t)}
                  />
                ))
              ) : (
                <View style={styles.noToursBox}>
                  <Sparkles size={32} color={COLORS.muted} />
                  <Text style={styles.noToursText}>
                    Upcoming tours for {destination.name} will be announced soon!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
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
    paddingBottom: 40,
  },

  heroContainer: {
    height: 220,
    position: "relative",
    backgroundColor: "#000",
    justifyContent: "space-between",
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  heroHeaderActions: {
    paddingHorizontal: 14,
    paddingTop: 8,
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

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  heroBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  heroBottomInfo: {
    padding: 14,
  },

  countryPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    marginBottom: 4,
  },

  countryPillText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
  },

  body: {
    padding: 16,
  },

  // Minimal Specs Strip
  specsStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAEFF5",
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 20,
  },

  specColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  specValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginTop: 3,
    textAlign: "center",
  },

  specLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 1,
    textAlign: "center",
  },

  specDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#E2E8F0",
  },

  section: {
    marginBottom: 20,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  sectionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  descriptionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },

  highlightsWrap: {
    gap: 8,
  },

  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#D9ECFF",
  },

  highlightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E3A8A",
    flex: 1,
  },

  noToursBox: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  noToursText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
  },
});
