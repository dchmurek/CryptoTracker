import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Crypto } from "../../types.d";
import { fetchHistoricalData } from "../../api/cryptoApi";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const starEmpty = require("../../assets/star.png");
const starFull = require("../../assets/star-full.png");

interface CryptoDetailsProps {
  route: {
    params: {
      crypto: Crypto;
    };
  };
}

const RANGE_OPTIONS = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "3Y", days: 1095 },
];

export function CryptoDetails({ route }: CryptoDetailsProps) {
  const { crypto } = route.params;
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 40;
  const chartHeight = 220;

  const [historicalData, setHistoricalData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(RANGE_OPTIONS[0].label);
  const [highlight, setHighlight] = useState<{
    x: number;
    y: number;
    value: number;
    date: string;
  } | null>(null);

  useEffect(() => {
    const loadHistoricalData = async () => {
      setLoading(true);
      const days =
        RANGE_OPTIONS.find((opt) => opt.label === selectedRange)?.days || 1;
      const data = await fetchHistoricalData(crypto.id, days);
      setHistoricalData(data);
      setLoading(false);
      setHighlight(null);
    };
    loadHistoricalData();
  }, [crypto.id, selectedRange]);

  const prices = historicalData.map((item) => item[1]);
  const labels = historicalData
    .filter((_, i) => i % Math.ceil(historicalData.length / 6) === 0)
    .map((item) => {
      const date = new Date(item[0]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {/* Nagłówek */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {crypto.name} ({crypto.symbol.toUpperCase()})
        </Text>
      </View>

      {/* Cena i zmiana */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>${crypto.current_price.toFixed(2)}</Text>
        <Text
          style={[
            styles.change,
            crypto.price_change_percentage_24h >= 0
              ? styles.positive
              : styles.negative,
          ]}
        >
          {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
          {crypto.price_change_percentage_24h.toFixed(2)}%
        </Text>
      </View>

      {/* Zakres czasowy */}
      <View style={styles.rangeSelector}>
        {RANGE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.label}
            onPress={() => setSelectedRange(opt.label)}
            style={[
              styles.rangeButton,
              selectedRange === opt.label && styles.rangeButtonActive,
            ]}
          >
            <Text
              style={[
                styles.rangeText,
                selectedRange === opt.label && styles.rangeTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wykres */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : historicalData.length > 0 ? (
        <View style={{ position: "relative" }}>
          <LineChart
            data={{ labels, datasets: [{ data: prices }] }}
            width={chartWidth}
            height={chartHeight}
            withDots={false}
            withInnerLines={false}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#f9f9f9",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
              style: { borderRadius: 8 },
            }}
            onDataPointClick={(data) => {
              const ts = historicalData[data.index][0];
              const date = new Date(ts).toLocaleString();
              setHighlight({ x: data.x, y: data.y, value: data.value, date });
            }}
            bezier
            style={{
              marginVertical: 16,
              borderRadius: 8,
              backgroundColor: "transparent",
            }}
          />

          {/* Dekorator: pionowa linia i tooltip */}
          {highlight && (
            <Svg
              width={chartWidth}
              height={chartHeight}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {/* Pionowa linia */}
              <Line
                x1={highlight.x}
                y1={0}
                x2={highlight.x}
                y2={chartHeight}
                stroke="#888"
                strokeWidth={1}
                strokeDasharray="4,4"
              />

              {/* Tooltip */}
              <Rect
                x={highlight.x - 60}
                y={0}
                width={120}
                height={50}
                rx={6}
                ry={6}
                fill="#fff"
                stroke="#888"
              />
              <SvgText
                x={highlight.x}
                y={18}
                fill="#000"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {highlight.date}
              </SvgText>
              <SvgText
                x={highlight.x}
                y={36}
                fill="#000"
                fontSize="12"
                textAnchor="middle"
              >
                ${highlight.value.toFixed(2)}
              </SvgText>
            </Svg>
          )}
        </View>
      ) : (
        <Text style={styles.info}>Brak danych historycznych</Text>
      )}

      {/* Szczegóły */}
      <View style={styles.details}>
        <Text style={styles.detailText}>
          Volume: ${crypto.total_volume?.toLocaleString()}
        </Text>
        <Text style={styles.detailText}>High 24h: ${crypto.high_24h}</Text>
        <Text style={styles.detailText}>Low 24h: ${crypto.low_24h}</Text>
        <Text style={styles.detailText}>ATH: ${crypto.ath}</Text>
        <Text style={styles.detailText}>ATL: ${crypto.atl}</Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(crypto.last_updated).toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 20, marginLeft: 12, fontWeight: "bold", color: "#000" },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginTop: 16 },
  price: { fontSize: 32, fontWeight: "bold", color: "#000" },
  change: { fontSize: 18, marginLeft: 8 },
  positive: { color: "#4CAF50" },
  negative: { color: "#E91E63" },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 40,
    marginTop: 20,
  },
  rangeButton: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  rangeButtonActive: { backgroundColor: "#000" },
  rangeText: { fontSize: 12, color: "#333" },
  rangeTextActive: { color: "#fff", fontWeight: "bold" },
  info: { fontSize: 14, color: "#333", marginTop: 8 },
  details: { width: "100%", paddingHorizontal: 20, marginTop: 20 },
  detailText: { fontSize: 14, color: "#333", marginBottom: 6 },
  lastUpdated: { fontSize: 12, color: "#999", marginTop: 12, marginBottom: 40 },
});
