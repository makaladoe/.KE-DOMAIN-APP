// app/domain-search.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, HelperText, Card } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import theme from "../app/theme";

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

export default function DomainSearch() {
  const [category, setCategory] = useState("Company");
  const [domainName, setDomainName] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullDomain, setFullDomain] = useState<string | null>(null);

  const router = useRouter();
  const API_KEY = "at_K4R6ng5rtnE76FqBIhlWYhGo9Icsx";

  const handleSearch = async () => {
    if (!domainName) return;
    setLoading(true);
    setResult(null);

    const extension = domainCategories[category];
    const fullDomainName = `${domainName}${extension}`;
    setFullDomain(fullDomainName);

    try {
      const response = await fetch(
        `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${API_KEY}&domainName=${fullDomainName}&outputFormat=JSON`
      );
      const data = await response.json();

      if (data.DomainInfo && data.DomainInfo.domainAvailability) {
        setResult(
          data.DomainInfo.domainAvailability === "AVAILABLE"
            ? `✅ ${fullDomainName} is available`
            : `❌ ${fullDomainName} is already taken`
        );
      } else {
        setResult("⚠️ Unable to fetch domain availability.");
      }
    } catch (error) {
      console.error(error);
      setResult("⚠️ Error checking domain availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Title */}
      <Text style={styles.title}>Search a Domain</Text>

      {/* Domain Category Selection */}
      <Card style={styles.card}>
        <Text style={styles.label}>Select Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(val) => setCategory(val)}
          style={styles.picker}
        >
          {Object.keys(domainCategories).map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </Card>

      {/* Domain Name Input */}
      <Card style={styles.card}>
        <Text style={styles.label}>Enter Domain Name</Text>
        <TextInput
          mode="outlined"
          value={domainName}
          onChangeText={setDomainName}
          style={styles.input}
          right={<TextInput.Affix text={domainCategories[category]} />}
        />
        <HelperText type="info" style={styles.helperText}>
          Avoid "www" or spaces
        </HelperText>

        {/* Live Preview */}
        {domainName.length > 0 && (
          <Text style={styles.preview}>
            Preview: <Text style={styles.previewDomain}>{domainName}{domainCategories[category]}</Text>
          </Text>
        )}
      </Card>

      {/* Search Button */}
      <View style={styles.buttonWrapper}>
        <Button
          mode="contained"
          onPress={handleSearch}
          loading={loading}
          disabled={!domainName}
          style={styles.button}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.white}
        >
          Check Availability
        </Button>
      </View>

      {/* Result */}
      {result && (
        <Card
          style={[
            styles.resultCard,
            result.startsWith("✅")
              ? styles.successBackground
              : styles.errorBackground,
          ]}
        >
          <Text
            style={[
              styles.resultText,
              result.startsWith("✅")
                ? styles.successText
                : styles.errorText,
            ]}
          >
            {result}
          </Text>

          {result.startsWith("✅") && fullDomain && (
            <Button
              mode="contained"
              style={styles.registerButton}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.white}
              onPress={() =>
                router.push({
                  pathname: "/register",
                  params: { domain: fullDomain },
                })
              }
            >
              Register this Domain
            </Button>
          )}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.light,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: theme.colors.primary,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    padding: 12,
    backgroundColor: theme.colors.white,
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    color: theme.colors.secondary,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: theme.colors.light,
    borderRadius: 8,
  },
  input: {
    backgroundColor: theme.colors.white,
  },
  helperText: {
    color: theme.colors.secondary,
    marginTop: 4,
    fontSize: 12,
  },
  preview: {
    marginTop: 8,
    fontSize: 13,
    color: theme.colors.dark,
  },
  previewDomain: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: 12,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 30,
    width: "60%", // half-width button
  },
  resultCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "600",
  },
  successBackground: {
    backgroundColor: "#e9f8f0", // light green tint
  },
  errorBackground: {
    backgroundColor: "#fdecea", // light red tint
  },
  successText: {
    color: theme.colors.secondary,
  },
  errorText: {
    color: theme.colors.primary,
  },
  registerButton: {
    borderRadius: 8,
    marginTop: 10,
  },
});
