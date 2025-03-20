import { Text } from "@react-navigation/elements";
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
import { useNavigation } from "@react-navigation/native";

export function Home() {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  const loadCryptoData = async () => {
    const data = await fetchCryptoData();
    setCryptoData(data);
  };

  useEffect(() => {
    loadCryptoData();
    const intervalId = setInterval(() => {
      loadCryptoData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

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
            onPress={() => {
              navigation.navigate("CryptoDetails", { crypto: item });
            }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#aaa",
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
  cryptoName: { fontSize: 18, color: "#000" },
  cryptoPrice: { fontSize: 16, color: "#aaa" },
  buttonContainer: { marginTop: 20, alignItems: "center", gap: 10 },
});
