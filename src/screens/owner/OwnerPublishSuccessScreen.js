import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { CheckCircle2, Building2, Plus, Clock } from "lucide-react-native";
import COLORS from "../../constants/colors";
import StatusBadge from "../../components/owner/StatusBadge";
import PrimaryButton from "../../components/owner/PrimaryButton";
import SecondaryButton from "../../components/owner/SecondaryButton";

export default function OwnerPublishSuccessScreen({ route, navigation }) {
  const property = route?.params?.property;

  const handleViewMyProperties = () => {
    navigation.navigate("Properties");
  };

  const handleAddAnother = () => {
    navigation.navigate("Add", { initialStep: 1, editingProperty: null });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <CheckCircle2 size={54} color={COLORS.success} strokeWidth={2.3} />
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Property Submitted Successfully</Text>
        <Text style={styles.subtitle}>Your property has been sent for verification.</Text>

        {/* Status Badge */}
        <View style={styles.statusBox}>
          <Clock size={16} color="#D97706" style={{ marginRight: 6 }} />
          <Text style={styles.statusLabel}>Current Status: </Text>
          <StatusBadge status="Pending Verification" />
        </View>

        {/* Property Quick Summary Card */}
        {property && (
          <View style={styles.propertyCard}>
            {property.coverPhoto && (
              <Image source={{ uri: property.coverPhoto }} style={styles.propertyThumb} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {property.title}
              </Text>
              <Text style={styles.propertyLocality}>
                {property.locality}, {property.city}
              </Text>
              <Text style={styles.propertyPrice}>{property.priceFormatted}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Our verification team typically validates property ownership within 2 to 4 business hours. You'll receive a push notification once your listing goes live.
          </Text>
        </View>

        {/* Buttons: View My Properties (Primary) & Add Another Property */}
        <View style={styles.buttonStack}>
          <PrimaryButton
            title="View My Properties"
            onPress={handleViewMyProperties}
            icon={Building2}
            style={styles.primaryBtn}
          />

          <SecondaryButton
            title="Add Another Property"
            onPress={handleAddAnother}
            icon={Plus}
            variant="outline"
            style={styles.secondaryBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F8FAFC",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 6,
    borderColor: "#D1FAE5",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "400",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FCD34D",
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400E",
  },
  propertyCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 16,
  },
  propertyThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  propertyLocality: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "400",
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 28,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: "center",
  },
  buttonStack: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    width: "100%",
  },
  secondaryBtn: {
    width: "100%",
  },
});
