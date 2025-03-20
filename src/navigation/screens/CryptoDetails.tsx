import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Crypto } from "../../types.d";
import { fetchHistoricalData } from "../../api/cryptoApi";
import { LineChart } from "react-native-chart-kit";

interface CryptoDetailsProps {
  route: {
    params: {
      crypto: Crypto;
    };
  };
}

export function CryptoDetails({ route }: CryptoDetailsProps) {
  const { crypto } = route.params;

  if (!crypto) {
    console.error("Brak danych przekazanych do CryptoDetails");
    return (
      <View style={styles.container}>
        <Text>Brak danych o kryptowalucie.</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const [historicalData, setHistoricalData] = useState<number[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHistoricalData = async () => {
      const data = await fetchHistoricalData(crypto.id, 2);
      setHistoricalData(data);
      setLoading(false);
    };
    loadHistoricalData();
  }, [crypto.id]);

  const prices = historicalData.map((item) => item[1]);
  const labels = historicalData
    .filter((_, index) => index % 6 === 0)
    .map((item) => {
      const date = new Date(item[0]);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: crypto.image }} style={styles.cryptoIcon} />
      <Text style={styles.cryptoName}>
        {crypto.name} ({crypto.symbol.toUpperCase()})
      </Text>
      <Text style={styles.cryptoPrice}>💰 {crypto.current_price} USD</Text>
      <Text style={styles.cryptoChange}>
        📉 Zmiana 24h: {crypto.price_change_percentage_24h?.toFixed(2)}%
      </Text>
      <Text style={styles.cryptoMarketCap}>
        🔹 Kapitalizacja: {crypto.market_cap?.toLocaleString()} USD
      </Text>
      <Text style={styles.chartHeader}>Historia cen (2 dni)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : historicalData.length > 0 ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: prices,
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#aaa",
            backgroundGradientTo: "#eee",
            decimalPlaces: 3,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 2,
            },
            propsForDots: {
              r: "0",
            },
          }}
          bezier
          style={{
            marginVertical: 20,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text style={styles.info}>Brak danych historycznych</Text>
      )}
      <Text style={styles.info}>
        Wolumen: {crypto.total_volume?.toLocaleString()} USD
      </Text>
      <Text style={styles.info}>Najwyższa cena 24h: {crypto.high_24h} USD</Text>
      <Text style={styles.info}>Najniższa cena 24h: {crypto.low_24h} USD</Text>
      <Text style={styles.info}>ATH: {crypto.ath} USD</Text>
      <Text style={styles.info}>ATL: {crypto.atl} USD</Text>
      <Text style={styles.lastUpdated}>
        Ostatnia aktualizacja: {new Date(crypto.last_updated).toLocaleString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cryptoIcon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  cryptoName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  cryptoPrice: {
    fontSize: 22,
    color: "#4CAF50",
    marginBottom: 10,
  },
  cryptoChange: {
    fontSize: 20,
    color: "#E91E63",
    marginBottom: 10,
  },
  cryptoMarketCap: {
    fontSize: 20,
    color: "#f1c40f",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    marginBottom: 40,
  },
  chartHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
  },
});
