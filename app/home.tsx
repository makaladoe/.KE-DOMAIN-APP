// app/home.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../app/theme";

// Domains with categories
const domains = [
  { ext: ".ke", category: "Kenya General Use" },
  { ext: ".co.ke", category: "Commercial / Businesses" },
  { ext: ".or.ke", category: "Organizations / NGOs" },
  { ext: ".ne.ke", category: "Network Providers" },
  { ext: ".go.ke", category: "Government" },
  { ext: ".me.ke", category: "Personal Use" },
  { ext: ".mobi.ke", category: "Mobile Services" },
  { ext: ".info.ke", category: "Information Services" },
  { ext: ".sc.ke", category: "Schools" },
  { ext: ".ac.ke", category: "Higher Education" },
];

// Credibility stats
const stats = [
  { value: "110,000+", label: ".KE Domains" },
  { value: "10+", label: "Top Level Domains" },
  { value: "500+", label: "Registrars" },
];

// Kenya flag inspired colors
const colors = ["green", "red", "black", "gray"];

export default function Home() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  // Cycle through domains every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % domains.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const currentDomain = domains[index];

  return (
    <View style={styles.container}>
      {/* 🔥 Animated Hero Section */}
      <View style={styles.hero}>
        <Text
          style={[styles.heroTitle, { color: colors[index % colors.length] }]}
        >
          {currentDomain.ext}
        </Text>
        <Text
          style={[
            styles.categoryText,
            { color: colors[(index + 2) % colors.length] }, // opposite-ish color
          ]}
        >
          {currentDomain.category}
        </Text>
        <Text style={styles.heroSubtitle}>Kenya’s trusted domain space</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((item, i) => (
          <View key={i} style={styles.statBox}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Register Domain Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="key-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Register a Domain</Text>
        </View>
        <Text style={styles.description}>
          Secure your unique .KE domain name and start building your online
          presence.
        </Text>
        <Button
          mode="contained"
          style={styles.primaryButton}
          onPress={() => router.push("/domain-search")}
        >
          Register Domain
        </Button>
      </View>

      {/* Community Section with Sign Up / Sign In */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="people-outline"
            size={24}
            color={theme.colors.secondary}
          />
          <Text style={styles.sectionTitle}>Join the .KE Community</Text>
        </View>
        <Text style={styles.description}>
          Sign up today to manage domains, become a registrar, or join our
          growing staff network.
        </Text>

        <Button
          mode="contained"
          style={styles.secondaryButton}
          onPress={() => router.push("/signup")}
        >
          Sign Up
        </Button>

        <Button
          mode="contained"
          style={styles.primaryButton}
          onPress={() => router.push("/signin")}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.light,
  },
  hero: {
    marginBottom: 20,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.accent,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.accent,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    marginBottom: 20,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    marginLeft: 8,
    fontWeight: "600",
    color: theme.colors.dark,
  },
  description: {
    marginBottom: 15,
    color: theme.colors.accent,
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary,
  },
});
