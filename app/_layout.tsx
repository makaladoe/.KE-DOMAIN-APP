import { Stack } from "expo-router";
import { AuthProvider } from "../app/context/authcontext";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Layout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        {/* Top-right circular logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/kenic1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Screens */}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="domain-search" />
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="landing" />
            <Stack.Screen name="ai-domain-suggester" />
            <Stack.Screen name="domain-verifier" />
            <Stack.Screen name="registrar" />
            <Stack.Screen name="manage" />
            <Stack.Screen name="transfer" />
            <Stack.Screen name="performance" />
            <Stack.Screen name="delete" />
            <Stack.Screen name="manage-registrar" />
            <Stack.Screen name="about" />
            
          </Stack>
        </View>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoWrapper: {
    position: "absolute",
    top: 40, // keep it below status bar
    right: 20,
    width: width * 0.18, // responsive size (~18% of screen width)
    height: width * 0.18,
    borderRadius: 100, // makes it a perfect circle
    backgroundColor: "#fff", // optional background for contrast
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    width: "70%",
    height: "70%",
  },
  content: {
    flex: 1,
  },
});
