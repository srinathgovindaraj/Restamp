import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import COLORS from "../../constants/colors";

const STEPS = [
  { step: 1, label: "Property" },
  { step: 2, label: "Location" },
  { step: 3, label: "Details" },
  { step: 4, label: "Pricing" },
  { step: 5, label: "Media" },
  { step: 6, label: "Review" },
];

export default function StepIndicator({ currentStep = 1 }) {
  const progressPercent = Math.round((currentStep / 6) * 100);

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <Text style={styles.stepCounterText}>
          Step {currentStep} of 6
        </Text>
        <Text style={styles.stepTitleText}>
          {STEPS[currentStep - 1]?.label || ""}
        </Text>
      </View>

      {/* Thin continuous progress bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Discrete Step Nodes */}
      <View style={styles.nodesRow}>
        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <View key={s.step} style={styles.nodeItem}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                {isCompleted ? (
                  <Check size={11} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isCurrent && styles.circleTextCurrent,
                    ]}
                  >
                    {s.step}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.nodeLabel,
                  isCurrent && styles.nodeLabelCurrent,
                  isCompleted && styles.nodeLabelCompleted,
                ]}
                numberOfLines={1}
              >
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCounterText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stepTitleText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  nodesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nodeItem: {
    alignItems: "center",
    width: 48,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  circleCompleted: {
    backgroundColor: COLORS.success,
  },
  circleCurrent: {
    backgroundColor: COLORS.primary,
  },
  circleText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  circleTextCurrent: {
    color: "#FFFFFF",
  },
  nodeLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: "400",
    textAlign: "center",
  },
  nodeLabelCurrent: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  nodeLabelCompleted: {
    color: COLORS.textDark,
    fontWeight: "500",
  },
});
