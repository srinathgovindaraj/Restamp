import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { useWishlist } from "../context/WishlistContext";

export default function SavedScreen({ navigation }) {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Properties</Text>
        <Text style={styles.headerSubtitle}>{wishlist.length} properties saved</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={64} color={COLORS.muted} />
          <Text style={styles.emptyTitle}>No Saved Properties</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any property to save it to your shortlists.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.exploreBtnText}>Explore Properties</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {wishlist.map((property) => (
            <View key={property.id} style={styles.card}>
              <Image source={{ uri: property.image }} style={styles.cardImage} />

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromWishlist(property.id)}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </TouchableOpacity>

              <View style={styles.cardContent}>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{property.badge}</Text>
                  </View>
                  <Text style={styles.typeText}>{property.type}</Text>
                </View>

                <Text style={styles.title} numberOfLines={1}>
                  {property.title}
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {property.location}
                  </Text>
                </View>

                <View style={styles.footerRow}>
                  <Text style={styles.price}>
                    {property.price}{property.pricePeriod}
                  </Text>

                  <TouchableOpacity style={styles.contactBtn}>
                    <Ionicons name="call-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.contactBtnText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: COLORS.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  cardImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  typeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginRight: 24,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  contactBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
