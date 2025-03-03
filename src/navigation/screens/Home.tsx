import { Button, Text } from "@react-navigation/elements";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { fetchCryptoData } from "../../api/cryptoApi";
import { Crypto } from "../../types.d";

export function Home() {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadCryptoData();
  }, []);

  const loadCryptoData = async () => {
    const data = await fetchCryptoData();
    setCryptoData(data);
  };

  const filteredData = cryptoData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchText.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CryptoTracker 📈</Text>

      {/* Wyszukiwarka */}
      <TextInput
        style={styles.searchInput}
        placeholder="🔎 Szukaj kryptowaluty..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Lista kryptowalut */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cryptoItem}
            onPress={() => console.log("Navigate to CryptoDetails", item)}
          >
            <Image source={{ uri: item.image }} style={styles.cryptoIcon} />
            <View>
              <Text style={styles.cryptoName}>
                {item.name} ({item.symbol.toUpperCase()})
              </Text>
              <Text style={styles.cryptoPrice}>
                💰 {item.current_price} USD
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Przykładowe przyciski nawigacji */}
      <View style={styles.buttonContainer}>
        <Button screen="Profile" params={{ user: "crypto" }}>
          Go to Profile
        </Button>
        <Button screen="Settings">Go to Settings</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#121212" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  cryptoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  cryptoIcon: { width: 40, height: 40, marginRight: 10 },
  cryptoName: { fontSize: 18, color: "#fff" },
  cryptoPrice: { fontSize: 16, color: "#aaa" },
  buttonContainer: { marginTop: 20, alignItems: "center", gap: 10 },
});
