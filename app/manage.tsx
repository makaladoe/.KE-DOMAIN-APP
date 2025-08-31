import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import theme from "../app/theme";

export default function ManageServices() {
  const router = useRouter();

  const services = [
    { title: "Check Status", description: "Verify your domain status", route: "/domain-verifier", color: theme.colors.primary },
    { title: "Transfer", description: "Transfer your domain easily", route: "/transfer", color: theme.colors.accent },
    { title: "Performance", description: "Monitor domain performance", route: "/performance", color: theme.colors.success },
    { title: "Delete", description: "Remove unused domains", route: "/delete", color: theme.colors.error },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Manage Your Domains</Text>
      <Text style={styles.subHeader}>Choose a service below to continue</Text>

      <View style={styles.cardsWrapper}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: service.color }]}
            activeOpacity={0.8}
            onPress={() => router.push(service.route as any)}
          >
            <Text style={styles.cardTitle}>{service.title}</Text>
            <Text style={styles.cardDescription}>{service.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    fontSize: 26,
    fontWeight: "700",
    color: theme.colors.dark,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: 20,
  },
  cardsWrapper: {
    flexDirection: "column",
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 14,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.dark,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.gray600 || theme.colors.secondary,
  },
});
