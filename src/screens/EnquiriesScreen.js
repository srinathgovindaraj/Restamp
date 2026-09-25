import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Modal,
  Linking,
  Alert,
  Platform,
} from "react-native";
import {
  Phone,
  MessageCircle,
  MapPin,
  Check,
  X,
  ChevronRight,
  Search,
  Copy,
  Calendar,
  Building,
} from "lucide-react-native";
import COLORS from "../constants/colors";
import ALL_PROPERTIES from "../data/properties";
import { useWishlist } from "../context/WishlistContext";
import PropertyDetailModal from "../components/PropertyDetailModal";

const INITIAL_ENQUIRIES = [
  {
    id: "enq-1",
    propertyId: "rec-omr-1",
    agentName: "Priya Natarajan",
    agency: "OMR Tech Realty",
    phone: "+91 98840 55667",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    propertyTitle: "Cyber Towers Gated Sky Villa",
    propertyPrice: "₹1.10 Cr",
    propertyLocation: "Sholinganallur, OMR",
    propertyImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Hi! Your site visit is confirmed for tomorrow Saturday at 3:30 PM. I'll meet you at Tower B lobby.",
    time: "10:30 AM",
    unread: true,
    category: "Site Visits",
    status: "Site Visit Confirmed",
    scheduledVisit: "Sat, 3:30 PM",
  },
  {
    id: "enq-2",
    propertyId: "chennai-1",
    agentName: "Kavitha Sundar",
    agency: "Anna Nagar Elite Homes",
    phone: "+91 98401 22334",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    propertyTitle: "Anna Nagar Tower View 3 BHK Flat",
    propertyPrice: "₹1.55 Cr",
    propertyLocation: "Anna Nagar East",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
    lastMessage: "The owner is willing to negotiate the token down to ₹2 Lakhs if we can execute this week.",
    time: "Yesterday",
    unread: false,
    category: "Negotiating",
    status: "Negotiation",
    scheduledVisit: null,
  },
  {
    id: "enq-3",
    propertyId: "rec-omr-2",
    agentName: "Suresh Babu",
    agency: "OMR Corridor Estates",
    phone: "+91 97909 33445",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    propertyTitle: "Greenfield Serene Luxury Villa",
    propertyPrice: "₹1.95 Cr",
    propertyLocation: "Navalur Junction, OMR",
    propertyImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80",
    lastMessage: "I have shared the CMDA approval copy, parent documents, and floor plan over WhatsApp.",
    time: "2 days ago",
    unread: false,
    category: "Active",
    status: "Documents Sent",
    scheduledVisit: null,
  },
  {
    id: "enq-4",
    propertyId: "chennai-2",
    agentName: "Ramesh Kumar",
    agency: "Chennai Prime Realty",
    phone: "+91 98410 77889",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    propertyTitle: "Shanthi Colony Gated House",
    propertyPrice: "₹3.10 Cr",
    propertyLocation: "Shanthi Colony, Anna Nagar",
    propertyImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Advance token verified and registration draft submitted with the legal team. Deal closed!",
    time: "5 days ago",
    unread: false,
    category: "Closed",
    status: "Closed",
    scheduledVisit: null,
  },
];

const FILTER_TABS = ["All", "Site Visits", "Negotiating", "Closed"];

export default function EnquiriesScreen({ navigation }) {
  const { wishlist, isWishlisted, toggleWishlist } = useWishlist();
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [contactSheetEnquiry, setContactSheetEnquiry] = useState(null);

  // Filter
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "Site Visits"
        ? item.category === "Site Visits" || !!item.scheduledVisit
        : activeTab === "Negotiating"
        ? item.category === "Negotiating" || item.status.includes("Negotiat")
        : activeTab === "Closed"
        ? item.category === "Closed" || item.status.includes("Closed")
        : true;

    const matchesSearch =
      searchQuery.trim() === "" ||
      item.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agency.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Contact Handlers
  const handleWhatsApp = (item) => {
    const rawPhone = item.phone || "+919876543210";
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Hello ${item.agentName}! I am following up on my enquiry for ${item.propertyTitle} (${item.propertyPrice}) in ${item.propertyLocation} on RESTAMP.`
    );
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${text}`).catch(() => {
      Alert.alert("WhatsApp Not Available", `Please contact ${item.agentName} at ${rawPhone}`);
    });
  };

  const handleCall = (item) => {
    const rawPhone = item.phone || "+919876543210";
    const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Call Agent", `${item.agentName}: ${rawPhone}`);
    });
  };

  const handleOpenProperty = (item) => {
    const found = ALL_PROPERTIES.find((p) => p.id === item.propertyId);
    if (found) {
      setSelectedProperty(found);
    } else {
      setSelectedProperty({
        id: item.propertyId,
        title: item.propertyTitle,
        price: item.propertyPrice,
        location: item.propertyLocation,
        image: item.propertyImage,
        agent: {
          name: item.agentName,
          agency: item.agency,
          phone: item.phone,
          avatar: item.avatar,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FB" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Enquiries</Text>
            <Text style={styles.headerSubtitle}>
              {filteredEnquiries.length} {filteredEnquiries.length === 1 ? "conversation" : "conversations"}
            </Text>
          </View>
          <View style={styles.headerCountBadge}>
            <Text style={styles.headerCountText}>{filteredEnquiries.length}</Text>
          </View>
        </View>

        {/* Minimal Search Bar */}
        <View style={styles.searchBar}>
          <Search size={15} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by property or agent..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Minimal Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEnquiries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageCircle size={36} color="#CBD5E1" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No enquiries</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "No matching conversations found." : "You have no enquiries in this section."}
            </Text>
          </View>
        ) : (
          filteredEnquiries.map((item) => {
            // Status styling
            let statusBg = "#EFF6FF";
            let statusTextColor = "#146EF5";
            if (item.category === "Site Visits" || item.scheduledVisit) {
              statusBg = "#EBF4FF";
              statusTextColor = "#146EF5";
            } else if (item.category === "Negotiating") {
              statusBg = "#FFFBEB";
              statusTextColor = "#D97706";
            } else if (item.status === "Documents Sent") {
              statusBg = "#F0FDF4";
              statusTextColor = "#16A34A";
            } else if (item.category === "Closed") {
              statusBg = "#F1F5F9";
              statusTextColor = "#64748B";
            }

            return (
              <View key={item.id} style={styles.card}>
                {/* 1. Top Row: Agent & Status */}
                <View style={styles.cardTopRow}>
                  <View style={styles.agentMetaRow}>
                    <View style={styles.avatarWrap}>
                      <Image source={{ uri: item.avatar }} style={styles.agentAvatar} />
                      <View style={styles.verifiedDot}>
                        <Check size={6} color="#FFFFFF" strokeWidth={4} />
                      </View>
                    </View>
                    <View style={styles.agentTextCol}>
                      <Text style={styles.agentName} numberOfLines={1}>
                        {item.agentName}
                      </Text>
                      <Text style={styles.agencyName} numberOfLines={1}>
                        {item.agency}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.topRightCol}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                      <Text style={[styles.statusPillText, { color: statusTextColor }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 2. Middle Row: Property Context (Clickable) */}
                <TouchableOpacity
                  style={styles.propertyContextBox}
                  activeOpacity={0.8}
                  onPress={() => handleOpenProperty(item)}
                >
                  <Image source={{ uri: item.propertyImage }} style={styles.propertyThumb} />
                  <View style={styles.propertyDetails}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {item.propertyTitle}
                    </Text>
                    <View style={styles.propertySubRow}>
                      <Text style={styles.propertyPrice}>{item.propertyPrice}</Text>
                      <Text style={styles.dotSeparator}>•</Text>
                      <MapPin size={11} color="#64748B" style={{ marginRight: 2 }} />
                      <Text style={styles.propertyLocation} numberOfLines={1}>
                        {item.propertyLocation}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>

                {/* 3. Last Message Snippet */}
                <View style={styles.messageBox}>
                  {item.unread && <View style={styles.unreadDot} />}
                  <Text style={styles.messageText} numberOfLines={2}>
                    {item.lastMessage}
                  </Text>
                </View>

                {/* 4. Action Row: Minimal Call & Message Buttons */}
                <View style={styles.actionRow}>
                  {/* Call Button (Solid Fill) */}
                  <TouchableOpacity
                    style={styles.callBtn}
                    activeOpacity={0.85}
                    onPress={() => handleCall(item)}
                  >
                    <Phone size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.callBtnText}>Call</Text>
                  </TouchableOpacity>

                  {/* Message Button (Solid Fill) */}
                  <TouchableOpacity
                    style={styles.messageBtn}
                    activeOpacity={0.85}
                    onPress={() => handleWhatsApp(item)}
                  >
                    <MessageCircle size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.messageBtnText}>Message</Text>
                  </TouchableOpacity>

                  {/* View Details / Number Button */}
                  <TouchableOpacity
                    style={styles.viewNumberBtn}
                    activeOpacity={0.85}
                    onPress={() => setContactSheetEnquiry(item)}
                  >
                    <Text style={styles.viewNumberBtnText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ================= AGENT CONTACT BOTTOM SHEET ================= */}
      <Modal
        visible={!!contactSheetEnquiry}
        transparent
        animationType="slide"
        onRequestClose={() => setContactSheetEnquiry(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContactSheetEnquiry(null)}
        >
          <TouchableOpacity
            style={styles.bottomSheet}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>{contactSheetEnquiry?.agentName}</Text>
                <Text style={styles.sheetSub}>{contactSheetEnquiry?.agency}</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setContactSheetEnquiry(null)}
              >
                <X size={17} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Context */}
            <View style={styles.sheetContextBar}>
              <Building size={13} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.sheetContextText} numberOfLines={1}>
                {contactSheetEnquiry?.propertyTitle} ({contactSheetEnquiry?.propertyPrice})
              </Text>
            </View>

            {/* Phone Display */}
            <TouchableOpacity
              style={styles.phoneBox}
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert("Copied!", `${contactSheetEnquiry?.phone} copied to clipboard.`);
              }}
            >
              <View style={styles.phoneIconCircle}>
                <Phone size={15} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.phoneLabel}>PHONE NUMBER</Text>
                <Text style={styles.phoneNumber}>{contactSheetEnquiry?.phone}</Text>
              </View>
              <View style={styles.copyPill}>
                <Copy size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.copyText}>Copy</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetActionsRow}>
              <TouchableOpacity
                style={styles.sheetCallBtn}
                activeOpacity={0.85}
                onPress={() => {
                  handleCall(contactSheetEnquiry);
                  setContactSheetEnquiry(null);
                }}
              >
                <Phone size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.sheetCallText}>Call Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetWhatsappBtn}
                activeOpacity={0.85}
                onPress={() => {
                  handleWhatsApp(contactSheetEnquiry);
                  setContactSheetEnquiry(null);
                }}
              >
                <MessageCircle size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
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
    backgroundColor: "#F4F7FB",
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
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
  headerCountBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  headerCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    paddingVertical: 0,
  },
  tabsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* List & Minimal Card */
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  /* Card Top Row */
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  agentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatarWrap: {
    position: "relative",
    marginRight: 10,
  },
  agentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  agentTextCol: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  agencyName: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 1,
  },
  topRightCol: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: "700",
  },

  /* Property Context Strip */
  propertyContextBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    marginBottom: 10,
  },
  propertyThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  propertyDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  propertySubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  propertyPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  dotSeparator: {
    marginHorizontal: 5,
    fontSize: 10,
    color: "#94A3B8",
  },
  propertyLocation: {
    fontSize: 11,
    color: "#64748B",
    flex: 1,
  },

  /* Last Message Box */
  messageBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 2,
    paddingVertical: 2,
    marginBottom: 12,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 5,
    marginRight: 6,
  },
  messageText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 17,
    flex: 1,
  },

  /* Minimal Action Buttons: Call & Message */
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
  },
  callBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  callBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  messageBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  viewNumberBtn: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  viewNumberBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },

  /* Empty State */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
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
    backgroundColor: "#EBF4FF",
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
    color: COLORS.primary,
  },
  sheetActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  sheetCallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
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
