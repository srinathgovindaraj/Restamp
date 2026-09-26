import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Check } from "lucide-react-native";
import COLORS from "../../constants/colors";

export default function SelectionChip({
  label,
  selected = false,
  onPress,
  icon: Icon,
  variant = "chip", // chip | card | segmented
  style,
  textStyle,
}) {
  const isCard = variant === "card";
  const isSegmented = variant === "segmented";

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isCard && styles.card,
        isSegmented && styles.segmented,
        selected && styles.selectedBase,
        selected && isCard && styles.selectedCard,
        selected && isSegmented && styles.selectedSegmented,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.innerRow}>
        {Icon && (
          <Icon
            size={isCard ? 20 : 15}
            color={selected ? COLORS.primary : COLORS.textSecondary}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.text,
            isCard && styles.cardText,
            selected && styles.selectedText,
            textStyle,
          ]}
        >
          {label}
        </Text>
        {selected && !isSegmented && !isCard && (
          <Check size={13} color={COLORS.primary} strokeWidth={3} style={{ marginLeft: 6 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginRight: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.textDark,
  },
  selectedBase: {
    borderColor: COLORS.primary,
    backgroundColor: "#EFF6FF",
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#F0F7FF",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  segmented: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    marginRight: 0,
    marginBottom: 0,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSegmented: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
