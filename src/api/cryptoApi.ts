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
