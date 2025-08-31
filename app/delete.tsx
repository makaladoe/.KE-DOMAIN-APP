import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import theme from "../app/theme";

export default function DeleteDomainScreen() {
  const [domain, setDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    if (!domain || !authCode) {
      Alert.alert("Missing Information", "Please enter both domain and authorization code.");
      return;
    }

    Alert.alert(
      "Final Confirmation",
      `Are you sure you want to permanently delete ${domain}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => performDelete(),
        },
      ]
    );
  };

  const performDelete = () => {
    setLoading(true);

    // Simulated checks
    setTimeout(() => {
      setLoading(false);

      // Example validation — in real case, API call to registrar
      if (domain === "example.com" && authCode === "12345") {
        Alert.alert(
          "Domain Deleted",
          `The domain ${domain} has been successfully removed from the registry. A confirmation email has been sent to your registered address.`
        );
        setDomain("");
        setAuthCode("");
      } else {
        Alert.alert(
          "Deletion Failed",
          "Unable to delete the domain. Ensure there are no pending bills and that the authorization code is correct."
        );
      }
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Delete Domain</Text>
      <Text style={styles.warningText}>
        ⚠️ Deleting a domain is a permanent action. Once deleted, your domain will be removed from
        the registry and may become available for others to register. Please proceed with caution.
      </Text>

      {/* Domain Input */}
      <Text style={styles.label}>Domain Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. mywebsite.com"
        placeholderTextColor={theme.colors.gray400}
        value={domain}
        onChangeText={setDomain}
      />

      {/* Auth Code Input */}
      <Text style={styles.label}>Authorization Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter auth/EPP code"
        placeholderTextColor={theme.colors.gray400}
        value={authCode}
        onChangeText={setAuthCode}
        secureTextEntry
      />

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={loading}>
        <Text style={styles.deleteBtnText}>{loading ? "Processing..." : "Delete Domain"}</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity style={styles.cancelBtn} onPress={() => Alert.alert("Cancelled", "Domain deletion cancelled.")}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.dark,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 15,
    color: theme.colors.warning,
    backgroundColor: theme.colors.gray100,
    padding: 14,
    borderRadius: theme.radius.md,
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.dark,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.radius.md,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: theme.colors.white,
  },
  deleteBtn: {
    backgroundColor: theme.colors.warning,
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    marginTop: 10,
    ...theme.shadow.medium,
  },
  deleteBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    color: theme.colors.secondary,
    fontSize: 15,
    fontWeight: "500",
  },
});
