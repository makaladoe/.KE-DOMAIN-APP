import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import theme from "../app/theme";

export default function TransferScreen() {
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => {
    if (step === 1 && !domain) return Alert.alert("Error", "Please enter a domain name.");
    if (step === 2 && !authCode) return Alert.alert("Error", "Please enter your Auth/EPP code.");
    if (step === 3 && !email) return Alert.alert("Error", "Please enter your email address.");
    setStep(step + 1);
  };

  const submitTransfer = () => {
    setSubmitted(true);
    setStep(5);
    // 🔹 Here you’d integrate API call to initiate domain transfer
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Domain Transfer</Text>
      <Text style={styles.subHeader}>Follow the steps below to transfer your domain</Text>

      {/* Progress indicator */}
      <View style={styles.progressWrapper}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.progressStep,
              step >= s ? styles.progressStepActive : styles.progressStepInactive,
            ]}
          />
        ))}
      </View>

      {/* Step 1 - Domain */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.label}>Enter Domain Name</Text>
          <TextInput
            style={styles.input}
            placeholder="example.co.ke"
            value={domain}
            onChangeText={setDomain}
          />
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 - Auth Code */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.label}>Enter Auth Code (EPP Code)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter authorization code"
            value={authCode}
            onChangeText={setAuthCode}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3 - Email */}
      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.label}>Enter Contact Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 4 - Review */}
      {step === 4 && (
        <View style={styles.card}>
          <Text style={styles.label}>Review Transfer Details</Text>
          <Text style={styles.reviewItem}>Domain: {domain}</Text>
          <Text style={styles.reviewItem}>Auth Code: {authCode ? "********" : ""}</Text>
          <Text style={styles.reviewItem}>Email: {email}</Text>
          <TouchableOpacity style={styles.button} onPress={submitTransfer}>
            <Text style={styles.buttonText}>Send Transfer Application</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 5 - Status */}
      {step === 5 && (
        <View style={styles.card}>
          <Text style={styles.label}>Transfer Status</Text>
          {submitted && (
            <Text style={styles.reviewItem}>
              Your transfer request has been submitted. You’ll receive an email confirmation shortly.
            </Text>
          )}
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      )}
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
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 15,
    color: theme.colors.secondary,
    marginBottom: 20,
  },
  progressWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressStep: {
    flex: 1,
    height: 6,
    marginHorizontal: 4,
    borderRadius: 3,
  },
  progressStepActive: {
    backgroundColor: theme.colors.primary,
  },
  progressStepInactive: {
    backgroundColor: theme.colors.gray300,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 14,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.dark,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: theme.colors.gray100,
    color: theme.colors.dark,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  reviewItem: {
    fontSize: 15,
    color: theme.colors.dark,
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: theme.colors.gray300,
    borderRadius: 5,
    marginTop: 12,
  },
  progressFill: {
    width: "40%", // 🔹 Dummy value for now
    height: "100%",
    backgroundColor: theme.colors.success,
    borderRadius: 5,
  },
});
