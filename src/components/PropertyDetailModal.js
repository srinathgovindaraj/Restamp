import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Calendar,
  Droplet,
  Activity,
  Shield,
  Zap,
  Layers,
  Truck,
  Home,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import TYPOGRAPHY from "../constants/typography";
import ALL_PROPERTIES, { RECOMMENDED_PROPERTIES } from "../data/properties";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const REC_CARD_WIDTH = 220;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "details", label: "Property Details" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
];

export default function PropertyDetailModal({
  visible,
  property,
  onClose,
  onSelectProperty,
  isWishlisted,
  onToggleWishlist,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [questionText, setQuestionText] = useState("");
  const [siteVisitRequested, setSiteVisitRequested] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  const mainScrollViewRef = useRef(null);
  const sectionYMap = useRef({});

  const scrollToSection = (tabId) => {
    setActiveTab(tabId);
    const yPos = sectionYMap.current[tabId];
    if (yPos !== undefined && mainScrollViewRef.current) {
      mainScrollViewRef.current.scrollTo({
        y: Math.max(0, yPos - 12),
        animated: true,
      });
    }
  };

  if (!property) return null;

  const saved = isWishlisted ? isWishlisted(property.id) : false;

  // Build photo gallery (main image + alternate architectural angles)
  const images = property.gallery && property.gallery.length > 0
    ? property.gallery
    : [
        property.image,
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      ];

  // Similar properties list excluding current property
  const similarProps = (RECOMMENDED_PROPERTIES || ALL_PROPERTIES)
    .filter((p) => p.id !== property.id)
    .slice(0, 5);

  const handleSendQuestion = () => {
    if (!questionText.trim()) {
      Alert.alert("Please enter your question", "Type your query before sending.");
      return;
    }
    Alert.alert(
      "Question Sent! 📩",
      `Your query regarding "${property.title}" has been forwarded to the owner. They will get back to you shortly!`,
      [{ text: "OK" }]
    );
    setQuestionText("");
  };

  const handleRequestSiteVisit = () => {
    setSiteVisitRequested(true);
    Alert.alert(
      "Site Visit Requested! 📅",
      `We have registered your request to visit "${property.title}". Our property consultant will contact you to confirm the time slot.`,
      [{ text: "Great, thanks!" }]
    );
  };

  const handleSendEnquiry = () => {
    setEnquirySent(true);
    Alert.alert(
      "Enquiry Sent Successfully! 🚀",
      `Your interest in "${property.title}" (${property.price}) has been shared with the property seller.`,
      [{ text: "Done" }]
    );
  };

  const quickQuestions = [
    "Is the price negotiable?",
    "Are home loans approved?",
    "Can I schedule a visit today?",
    "What is the maintenance fee?",
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalSafeArea} edges={["top", "left", "right"]}>
        {/* ================= HEADER BAR ================= */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={onClose} hitSlop={12}>
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Buyer Property Detail
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() => onToggleWishlist && onToggleWishlist(property)}
              hitSlop={8}
            >
              <Heart
                size={22}
                color={saved ? "#FF0000" : "#1E293B"}
                fill={saved ? "#FF0000" : "none"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionBtn} hitSlop={8}>
              <Share2 size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <ScrollView
          ref={mainScrollViewRef}
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* CHILD 0: HERO GALLERY & MAIN INFO */}
          <View>
            {/* 1. PROPERTY IMAGE GALLERY HERO */}
            <View style={styles.galleryContainer}>
              <Image
                source={{ uri: images[activeImageIndex] || property.image }}
                style={styles.heroImage}
                resizeMode="cover"
              />

              {/* Green Verified Badge */}
              {property.isVerified !== false && (
                <View style={styles.verifiedBadgeOverlay}>
                  <CheckCircle2 size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.verifiedBadgeText}>verified</Text>
                </View>
              )}

              {/* Heart wishlist overlay */}
              <TouchableOpacity
                style={styles.floatingHeartBtn}
                activeOpacity={0.8}
                onPress={() => onToggleWishlist && onToggleWishlist(property)}
              >
                <Heart
                  size={20}
                  color={saved ? "#FF0000" : "#FFFFFF"}
                  fill={saved ? "#FF0000" : "rgba(0,0,0,0.3)"}
                />
              </TouchableOpacity>

              {/* Image Thumbnail Selector Strip */}
              <View style={styles.thumbnailStrip}>
                {images.map((imgUri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => setActiveImageIndex(idx)}
                    style={[
                      styles.thumbnailWrapper,
                      activeImageIndex === idx && styles.thumbnailActive,
                    ]}
                  >
                    <Image source={{ uri: imgUri }} style={styles.thumbnailImg} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 2. PRICE & TITLE SECTION */}
            <View style={styles.mainInfoCard}>
              <Text style={styles.priceTag}>
                {property.price}
                <Text style={styles.pricePeriodText}>{property.pricePeriod}</Text>
              </Text>

              <Text style={styles.propertyTitleText}>{property.title}</Text>

              <View style={styles.locationRow}>
                <MapPin size={15} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>

              {/* 3. KEY SPECS STRIP (2 BHK | 1200 sqft | 2 Bath) */}
              <View style={styles.specsDividerStrip}>
                <Text style={styles.specPillText}>
                  {property.beds > 0 ? `${property.beds} BHK` : "Property"}
                </Text>
                <Text style={styles.specDotSeparator}>|</Text>
                <Text style={styles.specPillText}>{property.sqft} sqft</Text>
                <Text style={styles.specDotSeparator}>|</Text>
                <Text style={styles.specPillText}>{property.baths} Bath</Text>
              </View>
            </View>
          </View>

          {/* CHILD 1: STICKY SECTION NAVIGATION TAB BAR */}
          <View style={styles.tabBarContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabBarScroll}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    activeOpacity={0.8}
                    onPress={() => scrollToSection(tab.id)}
                    style={styles.tabItem}
                  >
                    <Text style={[styles.tabLabelText, isActive && styles.tabLabelTextActive]}>
                      {tab.label}
                    </Text>
                    {isActive && <View style={styles.activeTabIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 4. OVERVIEW & DESCRIPTION */}
          <View
            style={styles.sectionContainer}
            onLayout={(e) => {
              sectionYMap.current["overview"] = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.subSectionTitle}>Overview</Text>
            <Text style={styles.descriptionText}>
              {property.description ||
                "Exceptional residential property in prime location with excellent connectivity, natural lighting, modular fittings, and world-class building amenities. Ready for immediate possession."}
            </Text>
          </View>

          {/* 5. HIGHLIGHTS SECTION */}
          <View
            style={styles.sectionContainer}
            onLayout={(e) => {
              sectionYMap.current["highlights"] = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.subSectionTitle}>Highlights</Text>
            <View style={styles.highlightsList}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>Overlooking Main Road</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>3 sides open corner apartment with excellent ventilation</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>5 mins walk to Metro Station & Bus Terminus</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>Gated community with 24/7 Security & CCTV surveillance</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>100% Vastu Compliant East-facing layout</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>Freehold Property with Clear Legal Title</Text>
              </View>
            </View>
          </View>

          {/* 6. PROPERTY DETAILS GRID */}
          <View
            style={styles.sectionContainer}
            onLayout={(e) => {
              sectionYMap.current["details"] = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.subSectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailLabel}>Property Type</Text>
                <Text style={styles.detailValue}>{property.type || "Apartment"}</Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailLabel}>Listing Status</Text>
                <Text style={styles.detailValue}>{property.badge || "For Sale"}</Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailLabel}>Super Built-up</Text>
                <Text style={styles.detailValue}>{property.sqft} sq.ft.</Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailLabel}>Furnishing</Text>
                <Text style={styles.detailValue}>Semi-Furnished</Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailLabel}>Facing Direction</Text>
                <Text style={styles.detailValue}>East / North</Text>
              </View>
              <View style={styles.detailGridCell}>
                <Text style={styles.detailLabel}>Floor Level</Text>
                <Text style={styles.detailValue}>3rd of 5 Floors</Text>
              </View>
            </View>
          </View>

          {/* 7. AMENITIES */}
          <View
            style={styles.sectionContainer}
            onLayout={(e) => {
              sectionYMap.current["amenities"] = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.subSectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              <View style={styles.amenityChip}>
                <Droplet size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.amenityText}>Swimming Pool</Text>
              </View>
              <View style={styles.amenityChip}>
                <Activity size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.amenityText}>Gymnasium</Text>
              </View>
              <View style={styles.amenityChip}>
                <Shield size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.amenityText}>24/7 Security</Text>
              </View>
              <View style={styles.amenityChip}>
                <Zap size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.amenityText}>Power Backup</Text>
              </View>
              <View style={styles.amenityChip}>
                <Layers size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.amenityText}>Elevator</Text>
              </View>
              <View style={styles.amenityChip}>
                <Truck size={15} color="#0F172A" style={{ marginRight: 6 }} />
                <Text style={styles.amenityText}>Car Parking</Text>
              </View>
            </View>
          </View>

          {/* 8. FURNISHING STATUS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.subSectionTitle}>Furnishing</Text>
            <View style={styles.furnishingBox}>
              <Home size={18} color="#0F172A" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.furnishingTitle}>Semi-Furnished</Text>
                <Text style={styles.furnishingSubText}>Includes Modular Kitchen, Built-in Wardrobes & Designer Light Fittings.</Text>
              </View>
            </View>
          </View>

          {/* LOCATION / MAP */}
          <View
            style={styles.sectionContainer}
            onLayout={(e) => {
              sectionYMap.current["location"] = e.nativeEvent.layout.y;
            }}
          >
            <Text style={styles.subSectionTitle}>Location / Map</Text>
            <View style={styles.mapCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
                }}
                style={styles.mapImage}
              />
              <View style={styles.mapOverlay}>
                <MapPin size={24} color="#EF4444" />
                <Text style={styles.mapAddressText}>{property.address || property.location}</Text>
              </View>
            </View>
          </View>

          {/* 9. LISTED BY / PROPERTY OWNER */}
          <View style={styles.sectionContainer}>
            <Text style={styles.subSectionTitle}>Listed By</Text>
            <View style={styles.ownerCard}>
              <Image
                source={{
                  uri:
                    property.agent?.avatar ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                }}
                style={styles.ownerAvatar}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.ownerName}>
                  {property.agent?.name || "Property Owner"}
                </Text>
                <Text style={styles.ownerRole}>
                  {property.agent?.agency || "Verified Owner / Seller"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.ownerCallBtn}
                onPress={() =>
                  Alert.alert(
                    "Contacting Owner",
                    `Calling ${property.agent?.name || "Owner"} at ${property.agent?.phone || "+91 98765 43210"}`
                  )
                }
              >
                <Phone size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionDividerLine} />

          {/* 10. GOT QUESTIONS ABOUT THIS PROPERTY */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Got questions about this property</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsScroll}>
              {quickQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickQuestionChip}
                  onPress={() => setQuestionText(q)}
                >
                  <Text style={styles.quickQuestionText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.questionInputBox}>
              <TextInput
                style={styles.questionTextInput}
                placeholder="Type your question here..."
                placeholderTextColor="#94A3B8"
                value={questionText}
                onChangeText={setQuestionText}
              />
              <TouchableOpacity style={styles.questionSendBtn} onPress={handleSendQuestion}>
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionDividerLine} />

          {/* 11. SIMILAR PROPERTIES (RECOMMENDED PROPERTIES ONLY HAVE DETAIL PAGE) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Similar Properties</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarPropsScroll}
            >
              {similarProps.map((simProp) => {
                const isSimSaved = isWishlisted ? isWishlisted(simProp.id) : false;
                return (
                  <TouchableOpacity
                    key={simProp.id}
                    style={styles.recommendedCard}
                    activeOpacity={0.88}
                    onPress={() => {
                      if (onSelectProperty) {
                        onSelectProperty(simProp);
                      }
                    }}
                  >
                    <View style={styles.recommendedImageContainer}>
                      <Image source={{ uri: simProp.image }} style={styles.recommendedImage} />
                      <View style={styles.verifiedGreenBadge}>
                        <Text style={styles.verifiedGreenBadgeText}>verified</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.simHeartBtn}
                        activeOpacity={0.8}
                        onPress={(e) => {
                          e.stopPropagation();
                          if (onToggleWishlist) onToggleWishlist(simProp);
                        }}
                      >
                        <Heart
                          size={18}
                          color={isSimSaved ? "#FF0000" : "#FFFFFF"}
                          fill={isSimSaved ? "#FF0000" : "rgba(0,0,0,0.3)"}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.recommendedCardBody}>
                      <Text style={styles.recommendedTitle} numberOfLines={2}>
                        {simProp.title}
                      </Text>
                      <Text style={styles.recommendedSubtitle} numberOfLines={2}>
                        <Text style={styles.recommendedPrice}>
                          {simProp.price}{simProp.pricePeriod}
                        </Text>{" "}
                        • {simProp.location}. {simProp.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        {/* ================= FIXED BOTTOM ACTION STRIP ================= */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.siteVisitBtn, siteVisitRequested && styles.siteVisitBtnActive]}
            activeOpacity={0.85}
            onPress={handleRequestSiteVisit}
          >
            <Calendar
              size={18}
              color={siteVisitRequested ? "#10B981" : COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.siteVisitBtnText,
                siteVisitRequested && styles.siteVisitBtnTextActive,
              ]}
            >
              {siteVisitRequested ? "Requested ✓" : "Request Site Visit"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendEnquiryBtn, enquirySent && styles.sendEnquiryBtnActive]}
            activeOpacity={0.85}
            onPress={handleSendEnquiry}
          >
            <MessageSquare size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.sendEnquiryBtnText}>
              {enquirySent ? "Enquiry Sent ✓" : "Send Enquiry"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...TYPOGRAPHY.screenHeading,
    fontSize: 18,
    color: "#0F172A",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 90,
  },

  /* 1. GALLERY HERO */
  galleryContainer: {
    width: "100%",
    height: 260,
    backgroundColor: "#0F172A",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  verifiedBadgeOverlay: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "#16A34A",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  floatingHeartBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailStrip: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  thumbnailWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: "#FFFFFF",
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
  },

  /* 2. MAIN INFO CARD */
  mainInfoCard: {
    padding: 18,
    backgroundColor: "#FFFFFF",
  },
  priceTag: {
    fontSize: 26,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  pricePeriodText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#64748B",
  },
  propertyTitleText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "400",
  },

  /* 3. KEY SPECS STRIP */
  specsDividerStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  specPillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
  },
  specDotSeparator: {
    marginHorizontal: 12,
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "300",
  },

  /* SECTION NAVIGATION TAB BAR */
  tabBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    marginTop: 12,
  },
  tabBarScroll: {
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabLabelText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "400",
  },
  tabLabelTextActive: {
    color: "#0F172A",
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 14,
    right: 14,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  /* HIGHLIGHTS BULLET LIST */
  highlightsList: {
    marginTop: 6,
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletSymbol: {
    fontSize: 16,
    color: "#0F172A",
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    fontWeight: "400",
  },

  sectionDividerLine: {
    height: 8,
    backgroundColor: "#F1F5F9",
  },

  /* SECTIONS */
  sectionContainer: {
    padding: 18,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },

  /* DETAILS GRID (MINIMAL BORDERLESS LAYOUT) */
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
    columnGap: 12,
    marginTop: 8,
  },
  detailGridCell: {
    width: (SCREEN_WIDTH - 48) / 2,
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 3,
    fontWeight: "400",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },

  /* AMENITIES */
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amenityText: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "400",
  },

  /* FURNISHING */
  furnishingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  furnishingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 2,
  },
  furnishingSubText: {
    fontSize: 13,
    color: "#64748B",
  },

  /* MAP */
  mapCard: {
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginTop: 4,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  mapAddressText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },

  /* OWNER CARD */
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 4,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  ownerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },
  ownerRole: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  ownerCallBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  /* QUICK QUESTIONS */
  quickQuestionsScroll: {
    marginVertical: 10,
  },
  quickQuestionChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickQuestionText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "400",
  },
  questionInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  questionTextInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#0F172A",
  },
  questionSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  /* SIMILAR PROPERTIES */
  similarPropsScroll: {
    paddingRight: 18,
    gap: 14,
  },
  recommendedCard: {
    width: REC_CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  recommendedImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  recommendedImage: {
    width: "100%",
    height: "100%",
  },
  verifiedGreenBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedGreenBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  simHeartBtn: {
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
  recommendedCardBody: {
    padding: 12,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 4,
    lineHeight: 18,
  },
  recommendedSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  recommendedPrice: {
    fontWeight: "600",
    color: COLORS.primary,
  },

  /* FIXED BOTTOM BAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  siteVisitBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  siteVisitBtnActive: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  siteVisitBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  siteVisitBtnTextActive: {
    color: "#10B981",
  },
  sendEnquiryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendEnquiryBtnActive: {
    backgroundColor: "#059669",
  },
  sendEnquiryBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
