import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import theme from "../app/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        {/* Logo inside hero */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/kenic1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome to the .KE Domain App</Text>
        <Text style={styles.subtitle}>
          Secure your digital identity with trusted .KE domains
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Trust Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Accredited by KeNIC • Secure & Reliable
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
    justifyContent: "space-between",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing(4),
    backgroundColor: theme.colors.dark,
    position: "relative",
  },
  logoWrapper: {
    marginBottom: theme.spacing(2),
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: "80%",
    height: "80%",
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing(2),
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.gray200,
    textAlign: "center",
    marginBottom: theme.spacing(5),
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(6),
    borderRadius: theme.radius.xl,
    ...theme.shadow.medium,
  },
  ctaText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  footer: {
    paddingVertical: theme.spacing(3),
    backgroundColor: theme.colors.light,
    borderTopWidth: 1,
    borderColor: theme.colors.gray200,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.gray600,
    textAlign: "center",
  },
});
