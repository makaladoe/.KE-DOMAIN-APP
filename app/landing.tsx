import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../app/context/authcontext";
import theme from "../app/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Landing() {
  const navigation = useNavigation();
  const { signOutUser } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo + Header */}
      <Image source={require("../assets/images/kenic1.png")} style={styles.logo} />
      <Text style={styles.header}>Services</Text>

      {/* Register Domain */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("domain-search" as never)}
      >
        <MaterialCommunityIcons name="web" size={30} color={theme.colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Register a Domain</Text>
          <Text style={styles.cardText}>Search and secure your .KE domain name instantly.</Text>
        </View>
      </TouchableOpacity>

      {/* AI Domain Suggester */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ai-domain-suggester" as never)}
      >
        <MaterialCommunityIcons name="robot-happy-outline" size={30} color={theme.colors.secondary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>AI Domain Suggester</Text>
          <Text style={styles.cardText}>
            Get smart, professional, and brandable .KE domain name suggestions.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Verify Domain */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("manage" as never)}
      >
        <MaterialCommunityIcons name="shield-check-outline" size={30} color={theme.colors.success} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Manage Domains</Text>
          <Text style={styles.cardText}>
            Check status, expiry date, registrar info, and more.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Become Registrar */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("manage-registrar" as never)}
      >
        <MaterialCommunityIcons name="office-building-outline" size={30} color={theme.colors.gray700} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}> Registrar Management </Text>
          <Text style={styles.cardText}>
            Apply and manage registrar services with ease.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.logout} onPress={signOutUser}>
        <MaterialCommunityIcons name="logout" size={22} color={theme.colors.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing(3),
    backgroundColor: theme.colors.light,
    flexGrow: 1,
    justifyContent: "center",
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: "center",
    marginBottom: theme.spacing(1),
    borderRadius: theme.radius.full,
  },
  header: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.dark,
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: theme.spacing(2.5),
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing(2.5),
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    ...theme.shadow.light,
  },
  cardContent: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing(0.5),
    color: theme.colors.dark,
  },
  cardText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray700,
    lineHeight: theme.typography.lineHeight.normal * 16,
  },
  logout: {
    marginTop: theme.spacing(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(4),
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.full,
    ...theme.shadow.medium,
  },
  logoutText: {
    marginLeft: theme.spacing(1),
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
  },
});
