import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Calendar,
  Clock,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Check,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import PrimaryButton from "../../components/owner/PrimaryButton";

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "04:30 PM",
  "05:30 PM",
  "06:30 PM",
];

const QUICK_NOTES = [
  "Call at gate",
  "Meet at lobby",
  "Keys with security",
  "Parking spot ready",
];

function formatDateDisplay(date) {
  if (!date) return "";
  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isBeforeToday(d) {
  const now = new Date();
  const check = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return check < today;
}

function getDaysInMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const days = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      dayNumber: prevMonthTotalDays - i,
      date: new Date(year, month - 1, prevMonthTotalDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    days.push({
      dayNumber: d,
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete full grid
  const remainder = days.length % 7;
  if (remainder > 0) {
    const nextDaysNeeded = 7 - remainder;
    for (let n = 1; n <= nextDaysNeeded; n++) {
      days.push({
        dayNumber: n,
        date: new Date(year, month + 1, n),
        isCurrentMonth: false,
      });
    }
  }

  return days;
}

export default function OwnerSiteVisitModal({
  visible,
  lead,
  onClose,
  onVisitScheduled,
}) {
  const today = useMemo(() => new Date(), []);
  const initialSelected = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }, []);

  const [selectedDate, setSelectedDate] = useState(initialSelected);
  const [viewMonth, setViewMonth] = useState(
    new Date(initialSelected.getFullYear(), initialSelected.getMonth(), 1)
  );
  const [selectedTime, setSelectedTime] = useState("11:30 AM");
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!lead) return null;

  // Month navigation
  const isPrevMonthDisabled =
    viewMonth.getFullYear() < today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() <= today.getMonth());

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Quick Preset Handlers
  const handleQuickPreset = (daysFromToday) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    setSelectedDate(target);
    setViewMonth(new Date(target.getFullYear(), target.getMonth(), 1));
  };

  const handleWeekendPreset = () => {
    const target = new Date();
    const day = target.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    target.setDate(target.getDate() + diff);
    setSelectedDate(target);
    setViewMonth(new Date(target.getFullYear(), target.getMonth(), 1));
  };

  // Grid dates for viewMonth
  const calendarDays = useMemo(
    () => getDaysInMonth(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth]
  );

  const handleDaySelect = (item) => {
    if (isBeforeToday(item.date)) return;
    setSelectedDate(item.date);
    if (!item.isCurrentMonth) {
      setViewMonth(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
    }
  };

  const handleAddQuickNote = (tag) => {
    setNote((prev) => {
      if (!prev.trim()) return tag;
      if (prev.includes(tag)) return prev;
      return `${prev.trim()} • ${tag}`;
    });
  };

  const handleConfirm = () => {
    const formattedDate = formatDateDisplay(selectedDate);
    const visitDetails = {
      date: formattedDate,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
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
                <Text style={styles.summaryProperty}>
                  {lead.propertyTitle || "Property Site Visit"}
                </Text>
                <Text style={styles.summaryCust}>Visitor: {lead.customerName}</Text>
                <Text style={styles.summaryTime}>
                  📅 {formatDateDisplay(selectedDate)} at ⏰ {selectedTime}
                </Text>
                {note.trim() ? (
                  <Text style={styles.summaryNote}>📝 Note: {note.trim()}</Text>
                ) : null}
              </View>

              <PrimaryButton
                title="Done"
                onPress={handleDone}
                style={{ width: "100%", marginTop: 18 }}
              />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.title}>Schedule Site Visit</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    With {lead.customerName}
                    {lead.propertyTitle ? ` • ${lead.propertyTitle}` : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Quick Preset Pills */}
              <View style={styles.presetRow}>
                <TouchableOpacity
                  style={[
                    styles.presetChip,
                    isSameDay(selectedDate, today) && styles.presetChipActive,
                  ]}
                  onPress={() => handleQuickPreset(0)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      isSameDay(selectedDate, today) && styles.presetChipTextActive,
                    ]}
                  >
                    Today
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.presetChip,
                    isSameDay(
                      selectedDate,
                      new Date(today.getTime() + 86400000)
                    ) && styles.presetChipActive,
                  ]}
                  onPress={() => handleQuickPreset(1)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      isSameDay(
                        selectedDate,
                        new Date(today.getTime() + 86400000)
                      ) && styles.presetChipTextActive,
                    ]}
                  >
                    Tomorrow
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={handleWeekendPreset}
                  activeOpacity={0.75}
                >
                  <Text style={styles.presetChipText}>Weekend</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() => handleQuickPreset(7)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.presetChipText}>Next Week</Text>
                </TouchableOpacity>
              </View>

              {/* ================= MINI CALENDAR CARD ================= */}
              <View style={styles.calendarCard}>
                {/* Month & Year Navigation Bar */}
                <View style={styles.monthNavRow}>
                  <TouchableOpacity
                    style={[
                      styles.monthNavBtn,
                      isPrevMonthDisabled && styles.monthNavBtnDisabled,
                    ]}
                    onPress={handlePrevMonth}
                    disabled={isPrevMonthDisabled}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft
                      size={18}
                      color={isPrevMonthDisabled ? "#CBD5E1" : "#1E293B"}
                    />
                  </TouchableOpacity>

                  <View style={styles.monthLabelWrapper}>
                    <Calendar size={15} color={COLORS.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.monthLabelText}>
                      {MONTHS_FULL[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.monthNavBtn}
                    onPress={handleNextMonth}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={18} color="#1E293B" />
                  </TouchableOpacity>
                </View>

                {/* Day of Week Header */}
                <View style={styles.weekHeaderRow}>
                  {DAYS_OF_WEEK.map((d, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.weekDayText,
                        (index === 0 || index === 6) && styles.weekEndText,
                      ]}
                    >
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                  {calendarDays.map((item, index) => {
                    const isSelected = isSameDay(item.date, selectedDate);
                    const isCurrentDay = isSameDay(item.date, today);
                    const isDisabled = isBeforeToday(item.date);

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.dayCellWrapper}
                        disabled={isDisabled}
                        onPress={() => handleDaySelect(item)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellSelected,
                            isCurrentDay && !isSelected && styles.dayCellToday,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              !item.isCurrentMonth && styles.dayTextOtherMonth,
                              isDisabled && styles.dayTextDisabled,
                              isSelected && styles.dayTextSelected,
                              isCurrentDay && !isSelected && styles.dayTextToday,
                            ]}
                          >
                            {item.dayNumber}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Selected Date Confirmation Strip */}
                <View style={styles.selectedDateBadge}>
                  <Text style={styles.selectedDateBadgeLabel}>Selected Date:</Text>
                  <Text style={styles.selectedDateBadgeValue}>
                    {formatDateDisplay(selectedDate)}
                  </Text>
                </View>
              </View>

              {/* ================= TIME SLOT SELECTION ================= */}
              <View style={styles.sectionHeaderRow}>
                <Clock size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.sectionLabel}>Select Time Slot</Text>
              </View>

              <View style={styles.timeSlotsGrid}>
                {TIME_SLOTS.map((slot) => {
                  const isSlotActive = selectedTime === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.timeSlotChip,
                        isSlotActive && styles.timeSlotChipActive,
                      ]}
                      onPress={() => setSelectedTime(slot)}
                      activeOpacity={0.75}
                    >
                      {isSlotActive && (
                        <Check
                          size={12}
                          color={COLORS.primary}
                          strokeWidth={2.5}
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.timeSlotText,
                          isSlotActive && styles.timeSlotTextActive,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ================= NOTES SECTION ================= */}
              <View style={styles.sectionHeaderRow}>
                <FileText size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.sectionLabel}>Visit Notes & Instructions</Text>
              </View>

              {/* Quick Note Suggestions */}
              <View style={styles.quickNotesRow}>
                {QUICK_NOTES.map((qn) => (
                  <TouchableOpacity
                    key={qn}
                    style={styles.quickNoteTag}
                    onPress={() => handleAddQuickNote(qn)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.quickNoteTagText}>+ {qn}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder="e.g. Call security at main gate, meet at parking lobby, or require key from supervisor..."
                placeholderTextColor="#94A3B8"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
              />

              {/* ================= SUMMARY BAR ================= */}
              <View style={styles.scheduleSummaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>DATE</Text>
                  <Text style={styles.summaryItemValue}>
                    {formatDateDisplay(selectedDate)}
                  </Text>
                </View>
                <View style={styles.summaryItemDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryItemLabel}>TIME</Text>
                  <Text style={styles.summaryItemValue}>{selectedTime}</Text>
                </View>
              </View>

              {/* Confirm Visit Button */}
              <PrimaryButton
                title="Confirm Site Visit"
                onPress={handleConfirm}
                icon={Calendar}
                style={{ width: "100%", marginTop: 14 }}
              />
            </ScrollView>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "92%",
  },
  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Quick Presets */
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  presetChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
  },
  presetChipText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  presetChipTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  /* Mini Calendar Card */
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  monthNavBtnDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#F1F5F9",
  },
  monthLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthLabelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  weekHeaderRow: {
    flexDirection: "row",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  weekDayText: {
    width: "14.285%",
    textAlign: "center",
    fontSize: 11.5,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  weekEndText: {
    color: "#64748B",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCellWrapper: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  dayCell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  dayTextOtherMonth: {
    color: "#CBD5E1",
    fontWeight: "400",
  },
  dayTextDisabled: {
    color: "#E2E8F0",
    fontWeight: "400",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextToday: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  selectedDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  selectedDateBadgeLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#64748B",
  },
  selectedDateBadgeValue: {
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS.primary,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* Time Slots */
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  timeSlotChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeSlotChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  timeSlotTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  /* Quick Notes */
  quickNotesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  quickNoteTag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickNoteTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  noteInput: {
    minHeight: 74,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
    textAlignVertical: "top",
    marginBottom: 14,
  },

  /* Summary Card */
  scheduleSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemDivider: {
    width: 1,
    height: 26,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 12,
  },
  summaryItemLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryItemValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* Success View */
  successBox: {
    alignItems: "center",
    paddingVertical: 18,
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
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  successSub: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 18,
    fontWeight: "500",
  },
  summaryCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 5,
  },
  summaryProperty: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  summaryCust: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  summaryTime: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 2,
  },
  summaryNote: {
    fontSize: 12,
    color: "#475569",
    fontStyle: "italic",
    marginTop: 2,
  },
});
