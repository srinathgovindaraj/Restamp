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
  Check,
} from "lucide-react-native";
import COLORS from "../../constants/colors";

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

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
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_SLOTS = [
  { label: "9:30", period: "AM" },
  { label: "10:30", period: "AM" },
  { label: "11:30", period: "AM" },
  { label: "2:00", period: "PM" },
  { label: "3:30", period: "PM" },
  { label: "4:30", period: "PM" },
  { label: "5:30", period: "PM" },
  { label: "6:30", period: "PM" },
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

function formatDateShort(date) {
  if (!date) return "";
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  return `${day} ${month}`;
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
      return `${prev.trim()} · ${tag}`;
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

  // Preset checks
  const isTodayPreset = isSameDay(selectedDate, today);
  const tomorrowDate = new Date(today.getTime() + 86400000);
  const isTomorrowPreset = isSameDay(selectedDate, tomorrowDate);

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
        <Pressable style={styles.backdropPress} onPress={onClose} />

        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          {isSuccess ? (
            /* ── Success state ── */
            <View style={styles.successView}>
              <View style={styles.successIcon}>
                <CheckCircle2 size={36} color={COLORS.success} />
              </View>
              <Text style={styles.successTitle}>Visit Scheduled</Text>
              <Text style={styles.successSub}>
                Calendar invite sent to {lead.customerName}
              </Text>

              <View style={styles.successCard}>
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Property</Text>
                  <Text style={styles.successValue} numberOfLines={1}>
                    {lead.propertyTitle || "Property Site Visit"}
                  </Text>
                </View>
                <View style={styles.successDivider} />
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>Visitor</Text>
                  <Text style={styles.successValue}>{lead.customerName}</Text>
                </View>
                <View style={styles.successDivider} />
                <View style={styles.successRow}>
                  <Text style={styles.successLabel}>When</Text>
                  <Text style={styles.successValue}>
                    {formatDateShort(selectedDate)} · {selectedTime}
                  </Text>
                </View>
                {note.trim() ? (
                  <>
                    <View style={styles.successDivider} />
                    <View style={styles.successRow}>
                      <Text style={styles.successLabel}>Note</Text>
                      <Text style={styles.successValue} numberOfLines={2}>
                        {note.trim()}
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={handleDone}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Scheduling form ── */
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>Schedule Visit</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {lead.customerName}
                    {lead.propertyTitle ? ` · ${lead.propertyTitle}` : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <X size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Quick date presets */}
              <View style={styles.presetRow}>
                {[
                  { label: "Today", active: isTodayPreset, onPress: () => handleQuickPreset(0) },
                  { label: "Tomorrow", active: isTomorrowPreset, onPress: () => handleQuickPreset(1) },
                  { label: "Weekend", active: false, onPress: handleWeekendPreset },
                  { label: "Next Week", active: false, onPress: () => handleQuickPreset(7) },
                ].map((preset) => (
                  <TouchableOpacity
                    key={preset.label}
                    style={[styles.presetChip, preset.active && styles.presetChipActive]}
                    onPress={preset.onPress}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        preset.active && styles.presetTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── Calendar ── */}
              <View style={styles.calendar}>
                {/* Month nav */}
                <View style={styles.monthNav}>
                  <TouchableOpacity
                    onPress={handlePrevMonth}
                    disabled={isPrevMonthDisabled}
                    activeOpacity={0.7}
                    style={styles.monthArrow}
                  >
                    <ChevronLeft
                      size={20}
                      color={isPrevMonthDisabled ? COLORS.border : COLORS.textDark}
                    />
                  </TouchableOpacity>

                  <Text style={styles.monthLabel}>
                    {MONTHS_FULL[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                  </Text>

                  <TouchableOpacity
                    onPress={handleNextMonth}
                    activeOpacity={0.7}
                    style={styles.monthArrow}
                  >
                    <ChevronRight size={20} color={COLORS.textDark} />
                  </TouchableOpacity>
                </View>

                {/* Weekday header */}
                <View style={styles.weekRow}>
                  {DAYS_OF_WEEK.map((d, idx) => (
                    <Text key={idx} style={styles.weekDay}>
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Days grid */}
                <View style={styles.daysGrid}>
                  {calendarDays.map((item, index) => {
                    const isSelected = isSameDay(item.date, selectedDate);
                    const isToday = isSameDay(item.date, today);
                    const isDisabled = isBeforeToday(item.date);

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.dayCellWrap}
                        disabled={isDisabled}
                        onPress={() => handleDaySelect(item)}
                        activeOpacity={0.6}
                      >
                        <View
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellSelected,
                            isToday && !isSelected && styles.dayCellToday,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              !item.isCurrentMonth && styles.dayTextMuted,
                              isDisabled && styles.dayTextDisabled,
                              isSelected && styles.dayTextSelected,
                              isToday && !isSelected && styles.dayTextToday,
                            ]}
                          >
                            {item.dayNumber}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ── Time slots ── */}
              <Text style={styles.sectionLabel}>Time</Text>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((slot) => {
                  const fullSlot = `${slot.label} ${slot.period}`;
                  const isActive = selectedTime === fullSlot;
                  return (
                    <TouchableOpacity
                      key={fullSlot}
                      style={[styles.timeChip, isActive && styles.timeChipActive]}
                      onPress={() => setSelectedTime(fullSlot)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.timeText, isActive && styles.timeTextActive]}
                      >
                        {slot.label}
                      </Text>
                      <Text
                        style={[
                          styles.timePeriod,
                          isActive && styles.timePeriodActive,
                        ]}
                      >
                        {slot.period}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── Notes ── */}
              <Text style={styles.sectionLabel}>Note</Text>
              <View style={styles.quickNotesRow}>
                {QUICK_NOTES.map((qn) => (
                  <TouchableOpacity
                    key={qn}
                    style={[
                      styles.quickNote,
                      note.includes(qn) && styles.quickNoteActive,
                    ]}
                    onPress={() => handleAddQuickNote(qn)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.quickNoteText,
                        note.includes(qn) && styles.quickNoteTextActive,
                      ]}
                    >
                      {qn}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder="Add instructions for the visitor…"
                placeholderTextColor={COLORS.lightText}
                value={note}
                onChangeText={setNote}
                underlineColorAndroid="transparent"
                multiline
                numberOfLines={2}
              />

              {/* ── Bottom summary + confirm ── */}
              <View style={styles.bottomSection}>
                <View style={styles.summaryStrip}>
                  <View style={styles.summaryCol}>
                    <Text style={styles.summaryLabel}>DATE</Text>
                    <Text style={styles.summaryValue}>
                      {formatDateShort(selectedDate)}
                    </Text>
                  </View>
                  <View style={styles.summaryDot} />
                  <View style={styles.summaryCol}>
                    <Text style={styles.summaryLabel}>TIME</Text>
                    <Text style={styles.summaryValue}>{selectedTime}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Calendar
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.confirmBtnText}>Confirm Visit</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "90%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  /* ── Header ── */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: "400",
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.pageBackground,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Presets ── */
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.pageBackground,
    alignItems: "center",
  },
  presetChipActive: {
    backgroundColor: COLORS.primary,
  },
  presetText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  presetTextActive: {
    color: "#FFFFFF",
  },

  /* ── Calendar ── */
  calendar: {
    marginBottom: 24,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthArrow: {
    padding: 4,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    width: "14.285%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.lightText,
    textTransform: "uppercase",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCellWrap: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  dayTextMuted: {
    color: COLORS.border,
  },
  dayTextDisabled: {
    color: COLORS.borderLight,
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  dayTextToday: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  /* ── Section label ── */
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 10,
    letterSpacing: -0.1,
  },

  /* ── Time grid ── */
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.pageBackground,
  },
  timeChipActive: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  timeTextActive: {
    color: "#FFFFFF",
  },
  timePeriod: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  timePeriodActive: {
    color: "rgba(255,255,255,0.7)",
  },

  /* ── Quick notes ── */
  quickNotesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  quickNote: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.pageBackground,
  },
  quickNoteActive: {
    backgroundColor: COLORS.primaryLight,
  },
  quickNoteText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  quickNoteTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  noteInput: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.textDark,
    textAlignVertical: "top",
    marginBottom: 20,
    fontWeight: "400",
    outlineStyle: "none",
    outlineWidth: 0,
    outlineColor: "transparent",
  },

  /* ── Bottom ── */
  bottomSection: {
    gap: 12,
  },
  summaryStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.pageBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  summaryCol: {
    flex: 1,
  },
  summaryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.lightText,
    marginHorizontal: 12,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.lightText,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.1,
  },

  /* ── Success view ── */
  successView: {
    alignItems: "center",
    paddingVertical: 24,
    paddingBottom: 30,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.successBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "400",
    paddingHorizontal: 20,
  },
  successCard: {
    width: "100%",
    backgroundColor: COLORS.pageBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 4,
  },
  successRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  successDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  successLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.textSecondary,
  },
  successValue: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  doneBtn: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
