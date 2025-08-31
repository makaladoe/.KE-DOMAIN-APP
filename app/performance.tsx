import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import theme from "../app/theme";
import { VictoryLine, VictoryBar, VictoryChart, VictoryTheme, VictoryPie } from "victory";

const { width } = Dimensions.get("window");

export default function PerformanceScreen() {
  const visitsData = [
    { day: "Mon", visits: 120 },
    { day: "Tue", visits: 90 },
    { day: "Wed", visits: 150 },
    { day: "Thu", visits: 200 },
    { day: "Fri", visits: 170 },
    { day: "Sat", visits: 220 },
    { day: "Sun", visits: 140 },
  ];

  const uptime = 99.3;
  const dnsSpeed = 85; 
  const sslSecure = true;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Domain Performance</Text>
      <Text style={styles.subHeader}>
        Monitor the health and usage of your domain in real time.
      </Text>

      {/* Small Circles Row */}
      <View style={styles.circleRow}>
        {/* Uptime */}
        <View style={styles.circleCard}>
          <VictoryPie
            data={[
              { x: "Up", y: uptime },
              { x: "Down", y: 100 - uptime },
            ]}
            colorScale={[theme.colors.success, theme.colors.gray300]}
            labels={() => null}
            width={120}
            height={120}
            innerRadius={50}
            padAngle={3}
            style={{
              data: {
                stroke: theme.colors.light,
                strokeWidth: 2,
              },
            }}
          />
          <Text style={styles.circleLabel}>{uptime}%</Text>
          <Text style={styles.circleTitle}>Uptime</Text>
        </View>

        {/* DNS Speed */}
        <View style={styles.circleCard}>
          <VictoryPie
            data={[
              { x: "Fast", y: dnsSpeed },
              { x: "Remaining", y: 100 - dnsSpeed },
            ]}
            colorScale={[theme.colors.primary, theme.colors.gray300]}
            labels={() => null}
            width={120}
            height={120}
            innerRadius={50}
            padAngle={3}
            style={{
              data: {
                stroke: theme.colors.light,
                strokeWidth: 2,
              },
            }}
          />
          <Text style={styles.circleLabel}>{dnsSpeed}%</Text>
          <Text style={styles.circleTitle}>DNS Speed</Text>
        </View>
      </View>

      {/* Weekly Traffic */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Traffic</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={15}
          width={width * 0.9}
          height={220}
        >
          <VictoryLine
            data={visitsData}
            x="day"
            y="visits"
            style={{ data: { stroke: theme.colors.primary, strokeWidth: 2 } }}
          />
        </VictoryChart>
      </View>

      {/* Daily Visits Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Visits Breakdown</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={15}
          width={width * 0.9}
          height={220}
        >
          <VictoryBar
            data={visitsData}
            x="day"
            y="visits"
            style={{ data: { fill: theme.colors.secondary, width: 15 } }}
          />
        </VictoryChart>
      </View>

      {/* SSL */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>SSL/TLS Security</Text>
        <Text style={[styles.sslStatus, { color: sslSecure ? theme.colors.success : theme.colors.warning }]}>
          {sslSecure ? "Secure ✓" : "Not Secure ✗"}
        </Text>
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
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.dark,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 16,
  },
  circleRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  circleCard: {
    alignItems: "center",
  },
  circleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.dark,
    marginTop: -60,
  },
  circleTitle: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 6,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: 14,
    borderRadius: 12,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.dark,
    marginBottom: 10,
    textAlign: "center",
  },
  sslStatus: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
});
