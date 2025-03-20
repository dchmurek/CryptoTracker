import { Crypto } from "../types.d";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

export const fetchCryptoData = async (): Promise<Crypto[]> => {
  try {
    const response = await fetch(
      `${API_URL}?vs_currency=usd&order=market_cap_desc`
    );
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych");
    }
    return await response.json();
  } catch (error) {
    console.error("Błąd pobierania danych:", error);
    return [];
  }
};

export const fetchHistoricalData = async (
  cryptoId: string,
  days: number = 7
): Promise<number[][]> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania danych historycznych");
    }
    const data = await response.json();
    // Zakładamy, że data.prices to tablica [timestamp, price]
    return data.prices || [];
  } catch (error) {
    console.error("Błąd pobierania danych historycznych:", error);
    return [];
  }
};
