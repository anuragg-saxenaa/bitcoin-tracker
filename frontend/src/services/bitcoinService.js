import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const API_BASE_URL = 'http://localhost:8080/api/bitcoin';
const WS_URL = 'http://localhost:8080/ws';

class BitcoinService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  // REST API calls
  async getCurrentPrice() {
    try {
      const response = await axios.get(`${API_BASE_URL}/price`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current price:', error);
      throw error;
    }
  }

  async getPriceHistory(hours = 24) {
    try {
      const response = await axios.get(`${API_BASE_URL}/history?hours=${hours}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }

  // WebSocket connection
  connect(onPriceUpdate, onDisconnect) {
    try {
      const socket = new SockJS(WS_URL);
      this.stompClient = Stomp.over(socket);
      
      // Disable debug logging
      this.stompClient.debug = () => {};

      this.stompClient.connect(
        {},
        (frame) => {
          console.log('Connected to WebSocket:', frame);
          this.connected = true;
          
          // Subscribe to Bitcoin price updates
          this.stompClient.subscribe('/topic/bitcoin-price', (message) => {
            try {
              const priceData = JSON.parse(message.body);
              onPriceUpdate(priceData);
            } catch (error) {
              console.error('Error parsing price update:', error);
            }
          });
        },
        (error) => {
          console.error('WebSocket connection error:', error);
          this.connected = false;
          if (onDisconnect) {
            onDisconnect();
          }
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (!this.connected) {
              console.log('Attempting to reconnect...');
              this.connect(onPriceUpdate, onDisconnect);
            }
          }, 5000);
        }
      );
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      if (onDisconnect) {
        onDisconnect();
      }
    }
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const bitcoinService = new BitcoinService(); 