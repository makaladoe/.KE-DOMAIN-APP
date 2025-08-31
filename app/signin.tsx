// app/signin.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../app/context/authcontext";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons"; // ✅ for Google, Facebook, Apple
import theme from "../app/theme";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigation.navigate("landing" as never);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  // Placeholder handlers for social login
  const handleGoogle = () => console.log("Google Sign In");
  const handleFacebook = () => console.log("Facebook Sign In");
  const handleApple = () => console.log("Apple Sign In");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={theme.colors.accent}
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={theme.colors.accent}
          />
          <TouchableOpacity
            onPressIn={() => setShowPassword(true)}
            onPressOut={() => setShowPassword(false)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Sign In CTA */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialButton, { borderColor: "#DB4437" }]}
            onPress={handleGoogle}
            accessibilityLabel="Continue with Google"
          >
            <FontAwesome name="google" size={20} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { borderColor: "#1877F2" }]}
            onPress={handleFacebook}
            accessibilityLabel="Continue with Facebook"
          >
            <FontAwesome name="facebook" size={20} color="#1877F2" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { borderColor: "#000" }]}
            onPress={handleApple}
            accessibilityLabel="Continue with Apple"
          >
            <FontAwesome name="apple" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Footer link */}
        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("signup" as never)}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.light,
  },
  card: {
    width: "90%",
    maxWidth: 420,
    padding: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: theme.colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: theme.colors.dark,
    backgroundColor: theme.colors.white,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.white,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
    color: theme.colors.dark,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.accent,
  },
  dividerText: {
    marginHorizontal: 8,
    color: theme.colors.accent,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: theme.colors.white,
  },
  error: {
    color: theme.colors.error,
    marginBottom: 10,
    textAlign: "center",
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: theme.colors.accent,
  },
  link: {
    color: theme.colors.secondary,
    fontWeight: "700",
  },
});
