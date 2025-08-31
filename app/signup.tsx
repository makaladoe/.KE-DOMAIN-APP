// app/signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../app/context/authcontext";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import theme from "../app/theme";

export default function SignUp() {
  const { signUp } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signUp(email, password, role);
      setSuccess("✅ Account created successfully! Redirecting to Sign In...");
      setTimeout(() => {
        navigation.navigate("signin" as never);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Placeholder handlers for social signup
  const handleGoogleSignUp = () => {
    console.log("Google sign-up clicked");
  };
  const handleAppleSignUp = () => {
    console.log("Apple sign-up clicked");
  };
  const handleFacebookSignUp = () => {
    console.log("Facebook sign-up clicked");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPressIn={() => setShowPassword(true)}
            onPressOut={() => setShowPassword(false)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Role Dropdown */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            style={styles.picker}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Domain Register" value="domain-register" />
          </Picker>
        </View>

        {/* Primary Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#DB4437" }]} // Google red
            onPress={handleGoogleSignUp}
          >
            <Ionicons name="logo-google" size={20} color={theme.colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#000000" }]} // Apple black
            onPress={handleAppleSignUp}
          >
            <Ionicons name="logo-apple" size={20} color={theme.colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1877F2" }]} // Facebook blue
            onPress={handleFacebookSignUp}
          >
            <Ionicons
              name="logo-facebook"
              size={20}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* Footer link */}
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("signin" as never)}
          >
            Sign In
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
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
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
  dividerWrapper: {
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
    justifyContent: "center",
    marginBottom: 12,
    gap: 12,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: theme.colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  success: {
    color: theme.colors.secondary,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  footerText: {
    marginTop: 16,
    textAlign: "center",
    color: theme.colors.accent,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
});
