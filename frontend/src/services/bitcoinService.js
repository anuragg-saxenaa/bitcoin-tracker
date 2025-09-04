import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const API_BASE_URL = 'http://localhost:8080/api/bitcoin';
const WS_URL = 'http://localhost:8080/ws';

class BitcoinService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseReconnectDelay = 1000; // 1 second
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
          this.reconnectAttempts = 0; // Reset reconnection attempts on successful connection
          
          // Clear any existing reconnect timer
          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }
          
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
          
          this.scheduleReconnect(onPriceUpdate, onDisconnect);
        }
      );
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      if (onDisconnect) {
        onDisconnect();
      }
      this.scheduleReconnect(onPriceUpdate, onDisconnect);
    }
  }

  scheduleReconnect(onPriceUpdate, onDisconnect) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached. Giving up.');
      return;
    }

    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000 // Max 30 seconds
    );

    this.reconnectAttempts++;
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      if (!this.connected) {
        console.log('Attempting to reconnect...');
        this.connect(onPriceUpdate, onDisconnect);
      }
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
    
    // Reset reconnection state
    this.reconnectAttempts = 0;
  }

  isConnected() {
    return this.connected;
  }
}

export const bitcoinService = new BitcoinService(); 