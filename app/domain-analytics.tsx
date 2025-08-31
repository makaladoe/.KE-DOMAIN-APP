// app/test-image.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function TestImage() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/kenic1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.caption}>This is the logo test screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // center horizontally
    justifyContent: "center", // center vertically
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  caption: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
});
