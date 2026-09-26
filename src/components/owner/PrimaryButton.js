import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import COLORS from "../../constants/colors";

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon: Icon,
  style,
  textStyle,
  variant = "primary", // primary | danger | success
}) {
  let bgColor = COLORS.primary;
  if (variant === "danger") bgColor = COLORS.danger;
  if (variant === "success") bgColor = COLORS.success;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        disabled && styles.buttonDisabled,
        style,
      ]}
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.content}>
          {Icon && <Icon size={18} color="#FFFFFF" style={styles.icon} />}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
