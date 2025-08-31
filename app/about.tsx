import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from "react-native";
import theme from "../app/theme"; // ✅ import your theme

const { width } = Dimensions.get("window");

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image
        source={require("../assets/images/kenic1.png")}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Title */}
      <Text style={styles.title}>About Kenya Network Information Centre (KeNIC)</Text>

      {/* Intro */}
      <Text style={styles.text}>
        KeNIC is a company, licensed to manage and administer the dot KE Country Code 
        Top-Level Domain (.ke ccTLD) name. We are a registry with the sole responsibility 
        of administering, managing and operating .ke domains in Kenya.
      </Text>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>110,000+</Text>
          <Text style={styles.statLabel}>.KE Domains</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>10+</Text>
          <Text style={styles.statLabel}>Top Level Domains</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Registrars</Text>
        </View>
      </View>

      {/* Why .KE */}
      <Text style={styles.sectionTitle}>Why You Need a .KE Domain</Text>
      <Text style={styles.text}>
        A .ke domain is important for businesses and organizations that want to 
        establish a local presence in Kenya. It offers a unique Kenyan identity, 
        SEO benefits, brand security, credibility, and availability.
      </Text>

      {/* Contact Section */}
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.text}>
        📍 CAK Centre, Opposite Kianda School, Waiyaki Way {"\n"}
        📮 P.O Box 1461 - 00606, Nairobi - Kenya {"\n"}
        📞 +254 702 693 515 | +254 715 275 483 {"\n"}
        📧 customercare@kenic.or.ke
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
    padding: theme.layout.container,
  },
  banner: {
    width: "100%",
    height: width * 0.5, // ✅ Responsive banner height
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium as any,
    color: theme.colors.secondary,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  text: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 22,
    marginBottom: theme.spacing(3),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: theme.spacing(3),
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing(2),
    marginHorizontal: theme.spacing(1),
    borderRadius: theme.radius.lg,
    ...theme.shadow.medium,
    alignItems: "center",
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    marginTop: theme.spacing(1),
  },
});
