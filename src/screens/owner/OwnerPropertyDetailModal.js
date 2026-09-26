import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  X,
  MapPin,
  Building,
  CheckCircle2,
  Calendar,
  Eye,
  MessageSquare,
  ShieldCheck,
  Edit,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import StatusBadge from "../../components/owner/StatusBadge";
import PrimaryButton from "../../components/owner/PrimaryButton";

export default function OwnerPropertyDetailModal({
  visible,
  property,
  onClose,
  onEdit,
}) {
  if (!property) return null;

  const formattedPrice =
    property.priceFormatted ||
    (property.price
      ? `₹${property.price.toLocaleString("en-IN")}${property.priceUnit || ""}`
      : "Price On Request");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={20} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing Preview</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit?.(property)}
            activeOpacity={0.7}
          >
            <Edit size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Main Hero Image */}
          <View style={styles.heroContainer}>
            <Image
              source={{
                uri:
                  property.coverPhoto ||
                  property.images?.[0] ||
                  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
              }}
              style={styles.heroImage}
            />
            <View style={styles.heroBadgeRow}>
              <StatusBadge status={property.status} />
              <View style={styles.purposePill}>
                <Text style={styles.purposeText}>FOR {property.purpose?.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          {/* Core Info */}
          <View style={styles.contentSection}>
            <Text style={styles.title}>{property.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.locationText}>
                {property.address || `${property.locality}, ${property.city}`}
              </Text>
            </View>

            <Text style={styles.price}>{formattedPrice}</Text>

            {/* Quick Metrics */}
            <View style={styles.metricGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Built-up Area</Text>
                <Text style={styles.metricVal}>{property.builtUpArea || "1200 sq.ft"}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Carpet Area</Text>
                <Text style={styles.metricVal}>{property.carpetArea || "950 sq.ft"}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Furnishing</Text>
                <Text style={styles.metricVal}>{property.furnishing || "Semi Furnished"}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Floor</Text>
                <Text style={styles.metricVal}>
                  {property.floor} of {property.totalFloors}
                </Text>
              </View>
            </View>
          </View>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.chipsRow}>
                {property.amenities.map((item, idx) => (
                  <View key={idx} style={styles.amenityChip}>
                    <CheckCircle2 size={13} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Pricing Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Breakdown</Text>
            <View style={styles.pricingCard}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Expected / Monthly Rent</Text>
                <Text style={styles.pricingVal}>{formattedPrice}</Text>
              </View>
              {property.deposit && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Security Deposit</Text>
                  <Text style={styles.pricingVal}>
                    ₹{property.deposit.toLocaleString("en-IN")}
                  </Text>
                </View>
              )}
              {property.maintenance && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Maintenance</Text>
                  <Text style={styles.pricingVal}>
                    ₹{property.maintenance.toLocaleString("en-IN")} / mo
                  </Text>
                </View>
              )}
              {property.availableFrom && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Available From</Text>
                  <Text style={styles.pricingVal}>{property.availableFrom}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Verification Documents */}
          {property.documents?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification Documents</Text>
              {property.documents.map((doc, idx) => (
                <View key={idx} style={styles.docRow}>
                  <ShieldCheck size={16} color={COLORS.success} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{doc.name}</Text>
                    <Text style={styles.docType}>{doc.type} • {doc.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  heroContainer: {
    height: 220,
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroBadgeRow: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    gap: 8,
  },
  purposePill: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  purposeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },
  contentSection: {
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  price: {
    fontSize: 22,
    fontWeight: "500",
    color: COLORS.primary,
    marginBottom: 16,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricItem: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
    fontWeight: "400",
  },
  metricVal: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  section: {
    padding: 18,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amenityText: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.textDark,
  },
  pricingCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pricingLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  pricingVal: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  docName: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  docType: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
