import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Modal,
  Linking,
  Alert,
  Platform,
} from "react-native";
import {
  Heart,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Check,
  X,
  ArrowRight,
  Copy,
  Building,
} from "lucide-react-native";
import COLORS from "../constants/colors";
import { useWishlist } from "../context/WishlistContext";
import PropertyDetailModal from "../components/PropertyDetailModal";

export default function SavedScreen({ navigation }) {
  const { wishlist, removeFromWishlist, isWishlisted, toggleWishlist } = useWishlist();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewedNumberProperty, setViewedNumberProperty] = useState(null);

  // Helper calculations for cards
  const getCardSpecs = (property) => {
    const sqftNum = parseInt(String(property.sqft || 1500).replace(/,/g, "")) || 1500;
    const perSqft =
      property.rawPrice && sqftNum
        ? `₹${Math.round(property.rawPrice / sqftNum).toLocaleString("en-IN")}/sqft`
        : "₹6,800/sqft";
    const statusText =
      property.constructionStatus ||
      (property.badge === "Just Added" ? "New Launch" : "Ready to move");

    return { perSqft, statusText };
  };

  // Contact Handlers
  const handleWhatsApp = (property) => {
    const rawPhone = property.agent?.phone || "+919876543210";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello! I am interested in ${property.title} (${property.price}) in ${property.location} saved on my RESTAMP shortlists.`
    );
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${text}`).catch(() => {
      Alert.alert("WhatsApp Not Available", `Please contact ${property.agent?.name} at ${rawPhone}`);
    });
  };

  const handleCall = (property) => {
    const rawPhone = property.agent?.phone || "+919876543210";
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Call Agent", `${property.agent?.name || "Agent"}: ${rawPhone}`);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FB" />

      {/* Minimal Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Saved</Text>
          <Text style={styles.headerSubtitle}>
            {wishlist.length} {wishlist.length === 1 ? "property" : "properties"}
          </Text>
        </View>
        {wishlist.length > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{wishlist.length}</Text>
          </View>
        )}
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Heart size={36} color="#CBD5E1" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No saved properties</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any property card to save it here for quick access.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.exploreBtnText}>Explore Properties</Text>
            <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {wishlist.map((property) => {
            const { perSqft, statusText } = getCardSpecs(property);

            return (
              <TouchableOpacity
                key={property.id}
                style={styles.card}
                activeOpacity={0.88}
                onPress={() => setSelectedProperty(property)}
              >
                {/* Thumbnail Image on the Left */}
                <View style={styles.imageWrap}>
                  <Image source={{ uri: property.image }} style={styles.cardImage} />
                  {property.rating && (
                    <View style={styles.ratingOverlay}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingOverlayText}>{property.rating}</Text>
                    </View>
                  )}
                </View>

                {/* Content on the Right */}
                <View style={styles.cardContent}>
                  {/* Row 1: Title & Heart Unsave Button */}
                  <View style={styles.titleRow}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {property.address ? property.address.split(",")[0] : property.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.heartBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(property.id);
                      }}
                    >
                      <Heart size={18} color="#EF4444" fill="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Row 2: Price */}
                  <Text style={styles.propertyPrice}>
                    {property.price}
                    <Text style={styles.propertyPriceSub}> • {perSqft}</Text>
                  </Text>

                  {/* Row 3: Specs */}
                  <Text style={styles.specsText}>
                    {property.beds > 0 ? `${property.beds} beds` : "3 beds"} • {property.baths > 0 ? `${property.baths} baths` : "2 baths"} • {property.sqft} sq ft
                  </Text>

                  {/* Row 4: Location */}
                  <View style={styles.locationRow}>
                    <MapPin size={11} color="#64748B" style={{ marginRight: 3 }} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {property.address || property.location}
                    </Text>
                  </View>

                  {/* Row 5: Minimal Footer */}
                  <View style={styles.cardFooter}>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{statusText}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.contactBtn}
                      activeOpacity={0.8}
                      onPress={(e) => {
                        e.stopPropagation();
                        setViewedNumberProperty(property);
                      }}
                    >
                      <Phone size={11} color="#0F172A" style={{ marginRight: 4 }} />
                      <Text style={styles.contactBtnText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ================= MINIMAL CONTACT BOTTOM SHEET ================= */}
      <Modal
        visible={!!viewedNumberProperty}
        transparent
        animationType="slide"
        onRequestClose={() => setViewedNumberProperty(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setViewedNumberProperty(null)}
        >
          <TouchableOpacity
            style={styles.bottomSheet}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>
                  {viewedNumberProperty?.agent?.name || "Verified Agent"}
                </Text>
                <Text style={styles.sheetSub}>
                  {viewedNumberProperty?.agent?.agency || "Chennai Prime Realty"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setViewedNumberProperty(null)}
              >
                <X size={17} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Context */}
            <View style={styles.sheetContextBar}>
              <Building size={13} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.sheetContextText} numberOfLines={1}>
                {viewedNumberProperty?.title} ({viewedNumberProperty?.price})
              </Text>
            </View>

            {/* Phone Display */}
            <TouchableOpacity
              style={styles.phoneBox}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert(
                  "Copied!",
                  `${viewedNumberProperty?.agent?.phone || "+91 98401 22334"} copied to clipboard.`
                );
              }}
            >
              <View style={styles.phoneIconCircle}>
                <Phone size={14} color="#0F172A" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.phoneLabel}>PHONE NUMBER</Text>
                <Text style={styles.phoneNumber}>
                  {viewedNumberProperty?.agent?.phone || "+91 98401 22334"}
                </Text>
              </View>
              <View style={styles.copyPill}>
                <Copy size={11} color="#0F172A" style={{ marginRight: 4 }} />
                <Text style={styles.copyText}>Copy</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetActionsRow}>
              <TouchableOpacity
                style={styles.sheetCallBtn}
                activeOpacity={0.85}
                onPress={() => {
                  handleCall(viewedNumberProperty);
                  setViewedNumberProperty(null);
                }}
              >
                <Phone size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.sheetCallText}>Call Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetWhatsappBtn}
                activeOpacity={0.85}
                onPress={() => {
                  handleWhatsApp(viewedNumberProperty);
                  setViewedNumberProperty(null);
                }}
              >
                <MessageCircle size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.sheetWhatsappText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ================= PROPERTY DETAIL MODAL ================= */}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#F4F7FB",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
    fontWeight: "500",
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#0F172A",
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },

  /* Minimal Horizontal Card */
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  imageWrap: {
    width: 104,
    height: 104,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E2E8F0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ratingOverlay: {
    position: "absolute",
    bottom: 5,
    left: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingOverlayText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 3,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 6,
  },
  heartBtn: {
    padding: 2,
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  propertyPriceSub: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  specsText: {
    fontSize: 11.5,
    color: "#475569",
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: "#64748B",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 4,
  },
  statusPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  contactBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0F172A",
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },

  /* Bottom Sheet */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 22,
    width: "100%",
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  sheetSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContextBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  sheetContextText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
  phoneBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  phoneIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  phoneNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 1,
  },
  copyPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  copyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0F172A",
  },
  sheetActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  sheetCallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetCallText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sheetWhatsappBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetWhatsappText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
