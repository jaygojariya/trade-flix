import axios from "axios";

const API_BASE_URL = "https://apiconnect.angelbroking.com";

// Function to get IP and MAC address
const getIPAndMAC = async () => {
  try {
    // Get public IP
    const publicIPResponse = await axios.get(
      "https://api.ipify.org?format=json"
    );
    const publicIP = publicIPResponse.data.ip;

    // For local IP, we'll use a placeholder or try to estimate it
    const localIP = await estimateLocalIP();

    // For MAC address, we'll use a placeholder
    const macAddress = await generatePseudoMAC();

    return { localIP, publicIP, macAddress };
  } catch (error) {
    console.error("Error getting IP and MAC:", error);
    return {
      localIP: "192.168.1.1",
      publicIP: "0.0.0.0",
      macAddress: "00:00:00:00:00:00",
    };
  }
};

// Function to estimate local IP
const estimateLocalIP = async () => {
  const interfaces = await navigator.mediaDevices.enumerateDevices();
  return interfaces.length > 0 ? "192.168.1.1" : "10.0.0.1";
};

// Function to generate a pseudo MAC address
const generatePseudoMAC = () => {
  return "XX:XX:XX:XX:XX:XX".replace(/X/g, () => {
    return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
  });
};

// Create the API instance
const createAPI = async (apiKey) => {
  const { localIP, publicIP, macAddress } = await getIPAndMAC();

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-UserType": "USER",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": localIP,
      "X-ClientPublicIP": publicIP,
      "X-MACAddress": macAddress,
      "X-PrivateKey": "7sKm3pz3",
    },
  });
};

export const loginAndGetProfile = async (clientCode, password, totp) => {
  try {
    const api = await createAPI();

    const loginResponse = await api.post(
      "/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        clientcode: clientCode,
        password: password,
        totp: totp,
      }
    );
    if (loginResponse.data.status) {
      // Store the JWT token
      api.defaults.headers[
        "Authorization"
      ] = `Bearer ${loginResponse.data.data.jwtToken}`;

      // Fetch profile
      const profileResponse = await api.get(
        "/rest/secure/angelbroking/user/v1/getProfile"
      );
      const response = { ...loginResponse?.data?.data, ...profileResponse?.data?.data }
      return response
    } else {
      throw new Error(loginResponse.data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login or profile fetch error:", error);
    throw error;
  }
};

export const getQuote = async (jwtToken, symbol) => {
    try {
      const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
        }
      });
  
      const response = await api.post('/rest/secure/angelbroking/market/v1/quote', {
        mode: 'FULL',
        exchangeTokens: {
          NSE: [symbol]
        }
      });
  
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch quote');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw error;
    }
  };

export default createAPI;
