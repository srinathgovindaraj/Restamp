import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  prefix,
  suffix,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  helperText,
  error,
  style,
  inputStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
          !editable && styles.inputWrapperDisabled,
          multiline && { minHeight: 90, alignItems: "flex-start" },
        ]}
      >
        {prefix && <Text style={styles.prefixText}>{prefix}</Text>}

        <TextInput
          style={[
            styles.input,
            multiline && { textAlignVertical: "top", paddingTop: 10 },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {suffix && <Text style={styles.suffixText}>{suffix}</Text>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: "#F8FAFF",
  },
  inputWrapperError: {
    borderColor: COLORS.danger,
    backgroundColor: "#FEF2F2",
  },
  inputWrapperDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textDark,
    marginRight: 8,
  },
  suffixText: {
    fontSize: 13,
    fontWeight: "400",
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
    height: "100%",
  },
  helperText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: "500",
  },
});
