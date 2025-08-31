// app/registrar.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import theme from "../app/theme"; // ✅ import theme

// ---- Step Navigation Buttons ----
const NextPrev = ({
  onPrev,
  onNext,
}: {
  onPrev?: () => void;
  onNext?: () => void;
}) => (
  <View style={styles.navRow}>
    {onPrev && (
      <TouchableOpacity
        style={[styles.navBtn, styles.secondaryBtn]}
        onPress={onPrev}
      >
        <Text style={styles.navBtnText}>◀ Prev</Text>
      </TouchableOpacity>
    )}
    {onNext && (
      <TouchableOpacity
        style={[styles.navBtn, styles.primaryBtn]}
        onPress={onNext}
      >
        <Text style={[styles.navBtnText, styles.primaryBtnText]}>Next ▶</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ---- Form Component ----
export default function RegistrarApply() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);

  // States
  const [company, setCompany] = useState({
    name: "",
    regNumber: "",
    country: "",
    website: "",
  });
  const [contacts, setContacts] = useState({
    email: "",
    phone: "",
    address: "",
  });
  const [technical, setTechnical] = useState({
    dnsServers: "",
    infraDesc: "",
  });
  const [regulatory, setRegulatory] = useState({
    cakLicensed: false,
    cakLicenseNo: "",
    policies: {
      dataProtection: false,
      abuseHandling: false,
      termsOfService: false,
      privacyPolicy: false,
    },
  });
  const [financial, setFinancial] = useState({
    bank: "",
    account: "",
    proofFunds: "",
  });
  const [personnel, setPersonnel] = useState({
    adminContact: "",
    techContact: "",
  });
  const [security, setSecurity] = useState({
    dnssec: false,
    incidentPolicy: "",
  });
  const [declaration, setDeclaration] = useState({ agree: false });

  // ---- Step Views ----
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1) Company Info</Text>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
              style={styles.input}
              value={company.name}
              onChangeText={(v) => setCompany({ ...company, name: v })}
            />
            <Text style={styles.label}>Registration Number *</Text>
            <TextInput
              style={styles.input}
              value={company.regNumber}
              onChangeText={(v) => setCompany({ ...company, regNumber: v })}
            />
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={company.country}
              onChangeText={(v) => setCompany({ ...company, country: v })}
            />
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={company.website}
              onChangeText={(v) => setCompany({ ...company, website: v })}
            />
            <NextPrev onNext={() => setStep(2)} />
          </View>
        );

      case 2:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>2) Contact Info</Text>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={contacts.email}
              onChangeText={(v) => setContacts({ ...contacts, email: v })}
            />
            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              value={contacts.phone}
              onChangeText={(v) => setContacts({ ...contacts, phone: v })}
            />
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              value={contacts.address}
              onChangeText={(v) => setContacts({ ...contacts, address: v })}
            />
            <NextPrev onPrev={() => setStep(1)} onNext={() => setStep(3)} />
          </View>
        );

      case 3:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3) Regulatory</Text>
            <Text style={styles.label}>CAK License *</Text>
            <Picker
              selectedValue={regulatory.cakLicensed ? "Yes" : "No"}
              onValueChange={(v) =>
                setRegulatory((r) => ({ ...r, cakLicensed: v === "Yes" }))
              }
            >
              {["No", "Yes"].map((x) => (
                <Picker.Item key={x} label={x} value={x} />
              ))}
            </Picker>
            {regulatory.cakLicensed && (
              <>
                <Text style={styles.label}>CAK License Number *</Text>
                <TextInput
                  style={styles.input}
                  value={regulatory.cakLicenseNo}
                  onChangeText={(v) =>
                    setRegulatory((r) => ({ ...r, cakLicenseNo: v }))
                  }
                />
              </>
            )}

            <View style={styles.togglesCol}>
              {[
                { key: "dataProtection", label: "Data Protection Policy" },
                { key: "abuseHandling", label: "Abuse/Complaints Handling Policy" },
                { key: "termsOfService", label: "Terms of Service" },
                { key: "privacyPolicy", label: "Privacy Policy" },
              ].map((p) => (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.toggle,
                    (regulatory.policies as any)[p.key] && styles.toggleActive,
                  ]}
                  onPress={() =>
                    setRegulatory((r) => ({
                      ...r,
                      policies: {
                        ...r.policies,
                        [p.key]: !(r.policies as any)[p.key],
                      },
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.toggleText,
                      (regulatory.policies as any)[p.key] &&
                        styles.toggleTextActive,
                    ]}
                  >
                    {(regulatory.policies as any)[p.key] ? "✓ " : ""}
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <NextPrev onPrev={() => setStep(2)} onNext={() => setStep(4)} />
          </View>
        );

      case 4:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>4) Technical Setup</Text>
            <Text style={styles.label}>DNS Servers *</Text>
            <TextInput
              style={styles.input}
              value={technical.dnsServers}
              onChangeText={(v) => setTechnical({ ...technical, dnsServers: v })}
            />
            <Text style={styles.label}>Infrastructure Description *</Text>
            <TextInput
              style={[styles.input, styles.multiInput]}
              multiline
              value={technical.infraDesc}
              onChangeText={(v) =>
                setTechnical({ ...technical, infraDesc: v })
              }
            />
            <NextPrev onPrev={() => setStep(3)} onNext={() => setStep(5)} />
          </View>
        );

      case 5:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>5) Financial Info</Text>
            <Text style={styles.label}>Bank Name *</Text>
            <TextInput
              style={styles.input}
              value={financial.bank}
              onChangeText={(v) => setFinancial({ ...financial, bank: v })}
            />
            <Text style={styles.label}>Account Number *</Text>
            <TextInput
              style={styles.input}
              value={financial.account}
              onChangeText={(v) => setFinancial({ ...financial, account: v })}
            />
            <Text style={styles.label}>Proof of Funds *</Text>
            <TextInput
              style={[styles.input, styles.multiInput]}
              multiline
              value={financial.proofFunds}
              onChangeText={(v) =>
                setFinancial({ ...financial, proofFunds: v })
              }
            />
            <NextPrev onPrev={() => setStep(4)} onNext={() => setStep(6)} />
          </View>
        );

      case 6:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>6) Personnel</Text>
            <Text style={styles.label}>Admin Contact *</Text>
            <TextInput
              style={styles.input}
              value={personnel.adminContact}
              onChangeText={(v) =>
                setPersonnel({ ...personnel, adminContact: v })
              }
            />
            <Text style={styles.label}>Tech Contact *</Text>
            <TextInput
              style={styles.input}
              value={personnel.techContact}
              onChangeText={(v) =>
                setPersonnel({ ...personnel, techContact: v })
              }
            />
            <NextPrev onPrev={() => setStep(5)} onNext={() => setStep(7)} />
          </View>
        );

      case 7:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>7) Security Policies</Text>
            <View style={styles.togglesCol}>
              <TouchableOpacity
                style={[styles.toggle, security.dnssec && styles.toggleActive]}
                onPress={() =>
                  setSecurity((s) => ({ ...s, dnssec: !s.dnssec }))
                }
              >
                <Text
                  style={[styles.toggleText, security.dnssec && styles.toggleTextActive]}
                >
                  {security.dnssec ? "✓ " : ""}DNSSEC Support
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Incident Handling Policy *</Text>
            <TextInput
              style={[styles.input, styles.multiInput]}
              multiline
              value={security.incidentPolicy}
              onChangeText={(v) =>
                setSecurity({ ...security, incidentPolicy: v })
              }
            />
            <NextPrev onPrev={() => setStep(6)} onNext={() => setStep(8)} />
          </View>
        );

      case 8:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>8) Declaration</Text>
            <TouchableOpacity
              style={[styles.toggle, declaration.agree && styles.toggleActive]}
              onPress={() =>
                setDeclaration((d) => ({ ...d, agree: !d.agree }))
              }
            >
              <Text
                style={[styles.toggleText, declaration.agree && styles.toggleTextActive]}
              >
                {declaration.agree
                  ? "✓ "
                  : ""}{" "}
                I hereby declare all information provided is correct.
              </Text>
            </TouchableOpacity>

            <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.navBtn, styles.secondaryBtn]}
                onPress={() => setStep(7)}
              >
                <Text style={styles.navBtnText}>◀ Prev</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navBtn, styles.submitBtn]}
                onPress={() => {
                  alert("Your application has been submitted and is under review.");
                  router.push("/home");
                }}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Domain Registrar Application</Text>
      {renderStep()}
    </ScrollView>
  );
}

// ---- Themed Styles ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.gray100 },
  content: { padding: theme.layout.container, paddingBottom: theme.spacing(5) },
  header: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    textAlign: "center",
    color: theme.colors.primary,
    marginTop: theme.spacing(2),
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    marginTop: theme.spacing(2),
    ...theme.shadow.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing(2),
    color: theme.colors.dark,
  },
  label: {
    marginTop: theme.spacing(1.5),
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.gray800,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.radius.sm,
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    backgroundColor: theme.colors.gray100,
  },
  multiInput: {
    height: 80,
    textAlignVertical: "top",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(2.5),
  },
  navBtn: {
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(3),
    borderRadius: theme.radius.sm,
  },
  navBtnText: {
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.onLight,
  },
  primaryBtn: { backgroundColor: theme.colors.primary },
  primaryBtnText: { color: theme.colors.onPrimary },
  secondaryBtn: { backgroundColor: theme.colors.gray200 },
  submitBtn: { backgroundColor: theme.colors.secondary },
  submitBtnText: {
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.onSecondary,
  },
  togglesCol: { marginTop: theme.spacing(1.5), gap: theme.spacing(1) },
  toggle: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    padding: theme.spacing(1.5),
    borderRadius: theme.radius.sm,
  },
  toggleActive: {
    backgroundColor: theme.colors.gray200,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.gray800,
  },
  toggleTextActive: { color: theme.colors.primary },
});
