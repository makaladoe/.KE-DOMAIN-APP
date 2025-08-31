// app/register.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Linking,
  FlatList,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import registrarsData from "../app/data/registrars.json";
import theme from "../app/theme";

interface Registrar {
  id: number;
  name: string;
  phone: string;
  email: string;
  website: string;
  domains: string[];
  prices: { [key: string]: string | undefined };
}

export default function RegisterPage() {
  const { domain } = useLocalSearchParams<{ domain?: string }>();
  const [filteredRegistrars, setFilteredRegistrars] = useState<Registrar[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(15);

  // ✅ Responsive grid
  const { width } = useWindowDimensions();
  const numColumns = width < 600 ? 1 : width < 900 ? 2 : width < 1200 ? 3 : 5;

  // ✅ Extract domain extension
  const domainExtension = useMemo(() => {
    if (!domain) return undefined;
    const dotIndex = domain.indexOf(".");
    return dotIndex >= 0 ? domain.substring(dotIndex) : undefined;
  }, [domain]);

  // ✅ Filter registrars
  useEffect(() => {
    if (domainExtension) {
      const matches: Registrar[] = (registrarsData as Registrar[]).filter((r) =>
        r.domains.includes(domainExtension)
      );
      setFilteredRegistrars(matches);
    } else {
      setFilteredRegistrars(registrarsData as Registrar[]);
    }
  }, [domainExtension]);

  // ✅ Price parsing
  const parsePrice = (r: Registrar) => {
    const raw = r.prices[domainExtension || ""];
    const n = raw ? parseInt(raw.replace(/\D/g, ""), 10) : NaN;
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  };

  // ✅ Sorting + searching
  const sortedRegistrars = useMemo(() => {
    const base = filteredRegistrars.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return base.sort((a, b) => {
      const aP = parsePrice(a);
      const bP = parsePrice(b);
      return sortOrder === "asc" ? aP - bP : bP - aP;
    });
  }, [filteredRegistrars, searchQuery, sortOrder, domainExtension]);

  const limitedRegistrars = sortedRegistrars.slice(0, displayLimit);

  // ✅ Card is now fully touchable (no more "Register" button redundancy)
  const renderRegistrar = ({ item }: { item: Registrar }) => (
    <TouchableOpacity
      style={{ flex: 1, margin: 6 }}
      onPress={() => Linking.openURL(item.website)}
      activeOpacity={0.85}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              {item.prices[domainExtension || ""] || "Price N/A"}
            </Text>
            <Text style={styles.link}>{item.website}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Registering domain:{" "}
        <Text style={styles.headerDomain}>{domain ?? "—"}</Text>
      </Text>
      <Text style={styles.subHeaderText}>
        Showing {filteredRegistrars.length} accredited registrars
        {domainExtension ? ` for ${domainExtension}` : ""}
      </Text>

      {/* Controls */}
      <View style={styles.controlsRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search preferred registrar (optional)…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.gray500}
        />

        <View style={styles.sortControlsRight}>
          <TouchableOpacity
            style={[
              styles.chip,
              sortOrder === "asc" && styles.activeSecondaryChip,
            ]}
            onPress={() => setSortOrder("asc")}
          >
            <Text
              style={[
                styles.chipText,
                sortOrder === "asc" && styles.activeSecondaryChipText,
              ]}
            >
              Low → High
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chip,
              sortOrder === "desc" && styles.activeSecondaryChip,
            ]}
            onPress={() => setSortOrder("desc")}
          >
            <Text
              style={[
                styles.chipText,
                sortOrder === "desc" && styles.activeSecondaryChipText,
              ]}
            >
              High → Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results per page */}
      <Text style={styles.sortLabel}>Show first:</Text>
      <View style={styles.sortRow}>
        {[25, 50, 100].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.chip,
              displayLimit === num && styles.activeSecondaryChip,
            ]}
            onPress={() => setDisplayLimit(num)}
          >
            <Text
              style={[
                styles.chipText,
                displayLimit === num && styles.activeSecondaryChipText,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Registrar List */}
      <FlatList<Registrar>
        data={limitedRegistrars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRegistrar}
        contentContainerStyle={styles.list}
        numColumns={numColumns}
      />

      {/* See More */}
      {displayLimit < sortedRegistrars.length && (
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => setDisplayLimit(displayLimit + 15)}
        >
          <Text style={styles.seeMoreText}>See more registrars</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
    padding: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: theme.colors.dark,
  },
  headerDomain: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  subHeaderText: {
    fontSize: 13,
    color: theme.colors.gray600,
    marginBottom: 12,
  },

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  sortControlsRight: {
    flexDirection: "row",
  },

  sortLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: theme.colors.gray600,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: 8,
    backgroundColor: theme.colors.white,
  },
  chipText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  activeSecondaryChip: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  activeSecondaryChipText: {
    color: theme.colors.white,
  },

  list: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  info: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 2,
    color: theme.colors.dark,
  },
  price: {
    fontSize: 15,
    marginTop: 2,
    color: theme.colors.secondary,
    fontWeight: "600",
  },
  link: {
    color: theme.colors.primary,
    marginTop: 4,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  seeMoreButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    marginVertical: 12,
  },
  seeMoreText: {
    color: theme.colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
