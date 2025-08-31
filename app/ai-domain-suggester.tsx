// app/ai-domain-suggester.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../app/theme"; // default export from your theme.tsx

// ========== CONFIG ==========
const API_KEY = "at_K4R6ng5rtnE76FqBIhlWYhGo9Icsx"; // keep as you had

const domainCategories: { [key: string]: string } = {
  Company: ".co.ke",
  Government: ".go.ke",
  Organization: ".or.ke",
  Network: ".ne.ke",
  Personal: ".me.ke",
  Mobile: ".mobi.ke",
  Information: ".info.ke",
  School: ".sc.ke",
  Academic: ".ac.ke",
  General: ".ke",
};

// ========== HELPERS ==========
const clean = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toCamelBrand = (s: string) =>
  clean(s)
    .split(" ")
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");

const squeezeLen = (s: string, max = 15) =>
  s.length <= max ? s : s.slice(0, max);
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
const attachExt = (base: string, ext: string) => `${base}${ext}`;

const availabilityCheck = async (domain: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${API_KEY}&domainName=${encodeURIComponent(
        domain
      )}&outputFormat=JSON`
    );
    const data = await res.json();
    return data?.DomainInfo?.domainAvailability === "AVAILABLE";
  } catch {
    return false;
  }
};

// Pattern/gen helpers
const kenyaFlair = ["254", "ke", "hub", "pro", "zone", "base", "core"];

const patternize = (keywords: string[], opts?: { preferShort?: boolean }) => {
  const bases: string[] = [];
  const cleaned = keywords.map(clean).filter(Boolean);

  const push = (v: string) => {
    if (!v) return;
    bases.push(squeezeLen(v, opts?.preferShort ? 12 : 15));
  };

  for (let i = 0; i < cleaned.length - 1; i++) {
    push(toCamelBrand(cleaned[i] + cleaned[i + 1]));
  }

  cleaned.forEach((k) => {
    push(toCamelBrand(k));
    kenyaFlair.forEach((f) => push(toCamelBrand(k + " " + f)));
    push(toCamelBrand("go " + k));
    push(toCamelBrand("get " + k));
  });

  return uniq(bases.filter((x) => x.length >= 3));
};

const buildKeywordsByCategory = (inputs: any): string[] => {
  const desc = clean(inputs.description);
  const loc = clean(inputs.location || "");
  const name = clean(inputs.legalName || "");
  const tokens = desc.split(" ").filter(Boolean);

  switch (inputs.category) {
    case "Company":
      return [
        name,
        inputs.businessType,
        inputs.style,
        tokens[0],
        tokens[1],
        loc,
      ].filter(Boolean);
    case "School":
      return [
        name,
        inputs.level,
        inputs.faithBased === "Yes" ? "catholic" : "",
        "school",
        loc,
      ].filter(Boolean);
    case "Personal":
      return inputs.nameStyle === "Real Name"
        ? [inputs.fullName, inputs.initials, inputs.focus, loc].filter(Boolean)
        : [tokens[0], "portfolio", inputs.focus, loc].filter(Boolean);
    case "Organization":
      return [name, inputs.orgType, tokens[0], loc].filter(Boolean);
    default:
      return [name, tokens[0], tokens[1], loc].filter(Boolean);
  }
};

const generateSuggestions = (inputs: any, count = 6): string[] => {
  const ext = domainCategories[inputs.category];
  const keywords = buildKeywordsByCategory(inputs);
  const bases = patternize(keywords, { preferShort: inputs.preferShort });

  return uniq(bases.map((b) => attachExt(b, ext))).slice(0, count);
};

// ========== UI ==========
export default function AiDomainSuggester(): React.ReactElement {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // common
  const [category, setCategory] =
    useState<keyof typeof domainCategories>("Company");
  const [legalName, setLegalName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // specifics
  const [businessType, setBusinessType] = useState("Retail");
  const [styleOpt, setStyleOpt] = useState("Modern");
  const [preferShort, setPreferShort] = useState(true);
  const [schoolLevel, setSchoolLevel] = useState("Secondary");
  const [faithBased, setFaithBased] = useState("No");
  const [nameStyle, setNameStyle] = useState("Real Name");
  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");
  const [focus, setFocus] = useState("Portfolio");
  const [orgType, setOrgType] = useState("NGO");

  // results
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<
    Record<string, boolean | "checking">
  >({});

  const inputs = useMemo(
    () => ({
      category,
      description,
      location,
      legalName,
      businessType,
      style: styleOpt,
      preferShort,
      level: schoolLevel,
      faithBased,
      nameStyle,
      fullName,
      initials,
      focus,
      orgType,
    }),
    [
      category,
      description,
      location,
      legalName,
      businessType,
      styleOpt,
      preferShort,
      schoolLevel,
      faithBased,
      nameStyle,
      fullName,
      initials,
      focus,
      orgType,
    ]
  );

  const onGenerate = async () => {
    const list = generateSuggestions(inputs, 6);
    setSuggestions(list);

    setChecking(true);
    const init: Record<string, boolean | "checking"> = {};
    list.forEach((d: string) => (init[d] = "checking"));
    setAvailability(init);

    for (const d of list) {
      const ok = await availabilityCheck(d);
      setAvailability((prev) => ({ ...prev, [d]: ok }));
    }
    setChecking(false);
    setStep(3);
  };

  const onRegister = (domainToRegister: string) => {
    Alert.alert(
      "Domain Option",
      `The domain ${domainToRegister} is available. Would you like to refine suggestions or proceed with registration?`,
      [
        { text: "Refine", onPress: () => setStep(2) },
        {
          text: "Register",
          onPress: () =>
            router.push({
              pathname: "/register",
              params: { domain: domainToRegister },
            } as any),
        },
      ]
    );
  };

  // ====== RENDER ======
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* ✅ Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={theme.colors.dark} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>AI Domain Suggester</Text>
      <Text style={styles.subheader}>
        Answer a few quick prompts and get suggested .KE domains.
      </Text>

      {/* STEP 1 */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1) Choose a category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(v) => setCategory(v as any)}
            style={styles.picker}
          >
            {Object.keys(domainCategories).map((k) => (
              <Picker.Item
                key={k}
                label={`${k} (${domainCategories[k]})`}
                value={k}
              />
            ))}
          </Picker>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setStep(2)}
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2) Provide Details</Text>

          {(category === "Company" ||
            category === "Organization" ||
            category === "School") && (
            <>
              <Text style={styles.label}>Registered/Legal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Nairobi Auto Spares Ltd"
                value={legalName}
                onChangeText={setLegalName}
                placeholderTextColor={theme.colors.gray500}
              />
            </>
          )}

          <Text style={styles.label}>Brief description</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Affordable car parts in Nairobi"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={theme.colors.gray500}
          />

          {category === "Company" && (
            <>
              <Text style={styles.label}>Business Type</Text>
              <Picker
                selectedValue={businessType}
                onValueChange={(v) => setBusinessType(v as string)}
                style={styles.picker}
              >
                {[
                  "Retail",
                  "Tech",
                  "Automotive",
                  "Fashion",
                  "Food",
                  "Finance",
                  "Healthcare",
                  "Real Estate",
                  "Logistics",
                  "Other",
                ].map((t) => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </>
          )}

          {category === "Personal" && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Jane W. Kimani"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={theme.colors.gray500}
              />
            </>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setStep(1)}
            >
              <Text style={styles.secondaryBtnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={onGenerate}>
              {checking ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                <Text style={styles.primaryBtnText}>Generate</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3) Suggestions & Availability</Text>
          {suggestions.map((d: string) => {
            const status = availability[d];
            return (
              <View key={d} style={styles.resultRow}>
                <View>
                  <Text style={styles.domainText}>{d}</Text>
                  <Text
                    style={[
                      styles.statusText,
                      status === true
                        ? styles.available
                        : status === false
                        ? styles.unavailable
                        : styles.checking,
                    ]}
                  >
                    {status === "checking"
                      ? "Checking…"
                      : status
                      ? "Available ✓"
                      : "Taken ✕"}
                  </Text>
                </View>

                {status === true && (
                  <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={() => onRegister(d)}
                  >
                    <Text style={styles.registerBtnText}>Choose</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ========== STYLES ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette?.light?.background ?? theme.colors.light,
  },
  containerContent: {
    alignItems: "center", // ✅ center content
    padding: theme.layout?.container ?? theme.spacing(3),
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: theme.spacing(1),
  },
  backText: {
    marginLeft: 4,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
  },
  header: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    textAlign: "center",
    color: theme.colors.dark,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  subheader: {
    textAlign: "center",
    color: theme.colors.accent,
    marginBottom: theme.spacing(2),
    maxWidth: 500, // ✅ constrain width
  },
  card: {
    width: "90%", // ✅ not full width
    maxWidth: 500, // ✅ keeps it user-friendly
    backgroundColor: theme.palette?.light?.surface ?? theme.colors.white,
    borderRadius: theme.radius?.lg ?? 12,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    ...theme.shadow?.light,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold as any,
    marginBottom: theme.spacing(1),
    color: theme.colors.dark,
  },
  label: {
    fontWeight: theme.typography.fontWeight.medium as any,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    color: theme.colors.gray700 ?? theme.colors.accent,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.radius?.md ?? 8,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.colors.gray100,
    color: theme.colors.dark,
  },
  picker: {
    marginBottom: theme.spacing(1),
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  primaryBtn: {
    minWidth: 110,
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius?.md ?? 10,
    alignItems: "center",
    marginLeft: theme.spacing(1),
  },
  primaryBtnText: {
    color: theme.colors.onPrimary,
    fontWeight: theme.typography.fontWeight.bold as any,
  },
  secondaryBtn: {
    minWidth: 100,
    backgroundColor: theme.colors.gray200,
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius?.md ?? 10,
    alignItems: "center",
    marginRight: theme.spacing(1),
  },
  secondaryBtnText: {
    color: theme.colors.dark,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1.5),
    paddingVertical: theme.spacing(1),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  domainText: {
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.dark,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing(0.5),
  },
  available: { color: theme.colors.success },
  unavailable: { color: theme.colors.error },
  checking: { color: theme.colors.accent },
  registerBtn: {
    paddingVertical: theme.spacing(0.8),
    paddingHorizontal: theme.spacing(1.2),
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius?.sm ?? 6,
  },
  registerBtnText: {
    color: theme.colors.onSecondary ?? theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium as any,
  },
});
