import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import theme from "../app/theme";

// ===== CONFIG =====
const WHOISXML_API_KEY = "at_K4R6ng5rtnE76FqBIhlWYhGo9Icsx";

const TLD_PRICING: Record<string, { registerUSD: number; renewUSD: number }> = {
  ".ke": { registerUSD: 30, renewUSD: 30 },
  ".co.ke": { registerUSD: 15, renewUSD: 15 },
  ".or.ke": { registerUSD: 15, renewUSD: 15 },
  ".ac.ke": { registerUSD: 12, renewUSD: 12 },
  ".sc.ke": { registerUSD: 12, renewUSD: 12 },
  ".go.ke": { registerUSD: 0, renewUSD: 0 },
  ".ne.ke": { registerUSD: 12, renewUSD: 12 },
  ".me.ke": { registerUSD: 12, renewUSD: 12 },
  ".mobi.ke": { registerUSD: 12, renewUSD: 12 },
  ".info.ke": { registerUSD: 12, renewUSD: 12 },
};

// ===== HELPERS =====
const trimDomain = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .trim();

const tldOf = (domain: string): string => {
  const entries = Object.keys(TLD_PRICING).sort((a, b) => b.length - a.length);
  const match = entries.find((tld) => domain.endsWith(tld));
  if (match) return match;
  const idx = domain.indexOf(".");
  return idx > -1 ? domain.slice(domain.indexOf(".")) : "";
};

const withTimeout = async <T,>(p: Promise<T>, ms = 7000): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });

const safeFetchJson = async (url: string) => {
  try {
    const res = await withTimeout(fetch(url), 10000);
    return await res.json();
  } catch {
    return null;
  }
};

const probeSite = async (domain: string) => {
  try {
    const https = await withTimeout(fetch(`https://${domain}`, { method: "GET" }), 6000);
    return { reachable: true, protocol: "https", status: https.status || 200 };
  } catch {
    try {
      const http = await withTimeout(fetch(`http://${domain}`, { method: "GET" }), 6000);
      return { reachable: true, protocol: "http", status: http.status || 200 };
    } catch {
      return { reachable: false, protocol: null, status: null };
    }
  }
};

const inferActive = (dns: any, probe: { reachable: boolean }) => {
  const hasA =
    Array.isArray(dns?.A?.Answer) && dns.A.Answer.some((a: any) => a?.data && a.data !== "0.0.0.0");
  const hasAAAA = Array.isArray(dns?.AAAA?.Answer) && dns.AAAA.Answer.length > 0;
  const hasMX = Array.isArray(dns?.MX?.Answer) && dns.MX.Answer.length > 0;
  if ((hasA || hasAAAA || hasMX) && (probe.reachable || hasMX)) return "Active";
  return "Passive";
};

// ===== MAIN COMPONENT =====
export default function DomainVerifier() {
  const [rawDomain, setRawDomain] = useState("");
  const domain = useMemo(() => trimDomain(rawDomain), [rawDomain]);

  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);

  const runCheck = async () => {
    if (!domain || !domain.includes(".")) {
      setReport(null);
      setProgressMsg("Please enter a valid domain, e.g., example.co.ke");
      return;
    }

    setLoading(true);
    setReport(null);
    setProgressMsg("Starting checks…");

    try {
      // WHOIS
      setProgressMsg("Fetching WHOIS…");
      const whoisUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOISXML_API_KEY}&domainName=${encodeURIComponent(
        domain
      )}&outputFormat=JSON`;
      const whois = await safeFetchJson(whoisUrl);

      const record = whois?.WhoisRecord;
      const registered =
        typeof record?.dataError === "string"
          ? record.dataError.toLowerCase() !== "no whois data found"
          : Boolean(record);
      const registrar = record?.registrarName ?? record?.registrar ?? null;
      const createdDate = record?.createdDate ?? record?.registryData?.createdDate ?? null;
      const updatedDate = record?.updatedDate ?? record?.registryData?.updatedDate ?? null;
      const expiresDate = record?.expiresDate ?? record?.registryData?.expiresDate ?? null;
      const statuses = Array.isArray(record?.status)
        ? record.status
        : record?.status
        ? [String(record.status)]
        : [];
      const nameservers =
        record?.nameServers?.hostNames ??
        record?.registryData?.nameServers?.hostNames ??
        [];

      // RDAP
      setProgressMsg("Querying RDAP…");
      const rdap = await safeFetchJson(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
      const rdapStatuses: string[] = Array.isArray(rdap?.status)
        ? rdap.status
        : rdap?.status
        ? [String(rdap.status)]
        : [];
      const rdapNS: string[] =
        Array.isArray(rdap?.nameservers) ? rdap.nameservers.map((n: any) => n?.ldhName) : [];

      // DNS
      setProgressMsg("Resolving DNS…");
      const [dnsA, dnsAAAA, dnsMX, dnsNS] = await Promise.all([
        safeFetchJson(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`),
        safeFetchJson(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=AAAA`),
        safeFetchJson(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`),
        safeFetchJson(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=NS`),
      ]);

      const dns = {
        A: dnsA?.Answer?.map((a: any) => a.data) || [],
        AAAA: dnsAAAA?.Answer?.map((a: any) => a.data) || [],
        MX: dnsMX?.Answer?.map((a: any) => a.data?.split(" ").slice(-1)[0]) || [],
        NS: dnsNS?.Answer?.map((a: any) => a.data) || [],
      };

      // Probe
      setProgressMsg("Probing live site…");
      const live = await probeSite(domain);

      const activityHeuristic = inferActive({ A: dnsA, AAAA: dnsAAAA, MX: dnsMX }, live);
      const tld = tldOf(domain);
      const pricing = { ...(TLD_PRICING[tld] || {}), tld };

      setReport({
        domain,
        registered,
        registrar,
        createdDate,
        updatedDate,
        expiresDate,
        statuses,
        nameservers: nameservers?.length ? nameservers : rdapNS,
        rdapStatuses,
        dns,
        live,
        activityHeuristic,
        pricing,
      });
      setProgressMsg(null);
    } catch (e) {
      setProgressMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const openWhois = () => {
    if (domain) Linking.openURL(`https://rdap.org/domain/${encodeURIComponent(domain)}`).catch(() => {});
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Domain Verifier</Text>
      <Text style={styles.subheader}>
        Paste a domain to check registration status, WHOIS/RDAP, DNS, and live activity.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Domain</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., example.co.ke"
          placeholderTextColor={theme.colors.gray500}
          autoCapitalize="none"
          value={rawDomain}
          onChangeText={setRawDomain}
          keyboardType="url"
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={runCheck} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.primaryBtnText}>Verify</Text>
          )}
        </TouchableOpacity>

        {progressMsg ? <Text style={styles.progress}>{progressMsg}</Text> : null}
      </View>

      {report && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Verification Report</Text>

          <Row k="Domain" v={report.domain} />
          <Row k="Registered" v={report.registered ? "Yes" : "No"} />
          <Row k="Registrar" v={report.registrar || "—"} />
          <Row k="Created" v={report.createdDate || "—"} />
          <Row k="Updated" v={report.updatedDate || "—"} />
          <Row k="Expires" v={report.expiresDate || "—"} />
          <Row k="WHOIS Status" v={report.statuses?.join(", ") || "—"} />
          <Row k="RDAP Status" v={report.rdapStatuses?.join(", ") || "—"} />
          <Row k="Nameservers" v={report.nameservers?.join(", ") || "—"} />

          <Divider />

          <Text style={styles.subhead}>DNS Records</Text>
          <Row k="A" v={report.dns?.A?.join(", ") || "—"} />
          <Row k="AAAA" v={report.dns?.AAAA?.join(", ") || "—"} />
          <Row k="MX" v={report.dns?.MX?.join(", ") || "—"} />
          <Row k="NS" v={report.dns?.NS?.join(", ") || "—"} />

          <Divider />

          <Text style={styles.subhead}>Live Probe</Text>
          <Row
            k="Reachable"
            v={report.live?.reachable ? `Yes (${report.live.protocol?.toUpperCase()})` : "No"}
          />
          <Row k="HTTP Status" v={report.live?.status || "—"} />
          <Row k="Activity" v={report.activityHeuristic} />

          <Divider />

          <Text style={styles.subhead}>Estimated Retail</Text>
          <Row k="TLD" v={report.pricing?.tld || "—"} />
          <Row k="Register" v={report.pricing?.registerUSD ? `$${report.pricing.registerUSD}` : "—"} />
          <Row k="Renew" v={report.pricing?.renewUSD ? `$${report.pricing.renewUSD}` : "—"} />

          <TouchableOpacity style={styles.linkBtn} onPress={openWhois}>
            <Text style={styles.linkText}>Open RDAP record</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

// ===== STYLES (using theme.tsx) =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.light.background,
  },
  content: {
    padding: theme.layout.container,
    paddingBottom: theme.spacing(5),
  },
  header: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: "center",
    color: theme.colors.dark,
  },
  subheader: {
    textAlign: "center",
    color: theme.colors.gray600,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
  card: {
    backgroundColor: theme.palette.light.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(2),
    marginBottom: theme.layout.gutter,
    ...theme.shadow.light,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.gray800,
    marginBottom: theme.spacing(1),
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    backgroundColor: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.dark,
  },
  primaryBtn: {
  backgroundColor: theme.colors.secondary,
  paddingVertical: theme.spacing(1.5),
  paddingHorizontal: theme.spacing(4),   // 👈 give the button its natural width
  borderRadius: theme.radius.md,
  alignItems: "center",
  alignSelf: "center",                   // 👈 center it instead of stretching
  marginTop: theme.spacing(0.5),
  ...theme.shadow.medium,
  },
  primaryBtnText: {
    color: theme.colors.onPrimary,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
  },
  progress: {
    marginTop: theme.spacing(1),
    color: theme.colors.gray700,
    fontFamily: theme.typography.fontFamily.regular,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing(1.5),
  },
  subhead: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing(1),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing(0.75),
  },
  k: {
    color: theme.colors.gray700,
    fontFamily: theme.typography.fontFamily.medium,
    width: "45%",
  },
  v: {
    color: theme.colors.dark,
    fontFamily: theme.typography.fontFamily.regular,
    width: "55%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.gray200,
    marginVertical: theme.spacing(1.5),
  },
  linkBtn: {
    marginTop: theme.spacing(1),
    alignSelf: "flex-start",
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(1.5),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.gray100,
  },
  linkText: {
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
