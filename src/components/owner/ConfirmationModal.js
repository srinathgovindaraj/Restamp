import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import COLORS from "../../constants/colors";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary", // primary | danger
  icon: Icon,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {Icon && (
            <View
              style={[
                styles.iconWrap,
                variant === "danger" && styles.iconWrapDanger,
              ]}
            >
              <Icon
                size={26}
                color={variant === "danger" ? COLORS.danger : COLORS.primary}
              />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <SecondaryButton
              title={cancelText}
              onPress={onCancel}
              style={{ flex: 1 }}
              variant="subtle"
            />
            <PrimaryButton
              title={confirmText}
              onPress={onConfirm}
              style={{ flex: 1 }}
              variant={variant === "danger" ? "danger" : "primary"}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapDanger: {
    backgroundColor: "#FEE2E2",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: "400",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
});
