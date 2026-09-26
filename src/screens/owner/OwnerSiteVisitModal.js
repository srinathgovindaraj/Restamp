import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import { Calendar, Clock, CheckCircle2, X } from "lucide-react-native";
import COLORS from "../../constants/colors";
import PrimaryButton from "../../components/owner/PrimaryButton";
import SecondaryButton from "../../components/owner/SecondaryButton";

const DATES = [
  "Today",
  "Tomorrow",
  "Saturday, 28 Sep",
  "Sunday, 29 Sep",
  "Monday, 30 Sep",
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:00 PM",
  "05:30 PM",
];

export default function OwnerSiteVisitModal({
  visible,
  lead,
  onClose,
  onVisitScheduled,
}) {
  const [selectedDate, setSelectedDate] = useState("Tomorrow");
  const [selectedTime, setSelectedTime] = useState("11:30 AM");
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!lead) return null;

  const handleConfirm = () => {
    const visitDetails = {
      date: selectedDate,
      time: selectedTime,
      note: note.trim() || "Owner scheduled site walkthrough",
    };
    onVisitScheduled?.(lead.id, visitDetails);
    setIsSuccess(true);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.sheetHandle} />

          {isSuccess ? (
            <View style={styles.successBox}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={40} color={COLORS.success} />
              </View>
              <Text style={styles.successTitle}>Visit Scheduled!</Text>
              <Text style={styles.successSub}>
                Invitation and calendar invite dispatched to {lead.customerName}.
              </Text>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryProperty}>{lead.propertyTitle}</Text>
                <Text style={styles.summaryCust}>Customer: {lead.customerName}</Text>
                <Text style={styles.summaryTime}>
                  📅 {selectedDate} at ⏰ {selectedTime}
                </Text>
              </View>

              <PrimaryButton
                title="Done"
                onPress={handleDone}
                style={{ width: "100%", marginTop: 14 }}
              />
            </View>
          ) : (
            <View>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>Schedule Site Visit</Text>
                  <Text style={styles.subtitle}>With {lead.customerName}</Text>
                </View>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Date Selection */}
              <Text style={styles.sectionLabel}>Select Date</Text>
              <View style={styles.chipsWrap}>
                {DATES.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, selectedDate === d && styles.chipActive]}
                    onPress={() => setSelectedDate(d)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedDate === d && styles.chipTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Time Slot Selection */}
              <Text style={styles.sectionLabel}>Select Time Slot</Text>
              <View style={styles.chipsWrap}>
                {TIME_SLOTS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, selectedTime === t && styles.chipActive]}
                    onPress={() => setSelectedTime(t)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedTime === t && styles.chipTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Optional Note */}
              <Text style={styles.sectionLabel}>Optional Note for Visitor</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="e.g. Call security at gate or parking instructions..."
                placeholderTextColor="#94A3B8"
                value={note}
                onChangeText={setNote}
                multiline
              />

              {/* Confirm Visit Button */}
              <PrimaryButton
                title="Confirm Visit"
                onPress={handleConfirm}
                icon={Calendar}
                style={{ width: "100%", marginTop: 16 }}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "400",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 8,
    marginTop: 10,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.textDark,
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  noteInput: {
    minHeight: 70,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: COLORS.textDark,
    textAlignVertical: "top",
  },
  successBox: {
    alignItems: "center",
    paddingVertical: 12,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "400",
  },
  summaryCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 4,
  },
  summaryProperty: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  summaryCust: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  summaryTime: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.primary,
    marginTop: 4,
  },
});
