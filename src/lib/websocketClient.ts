import { WebSocketMessage } from '../types/api';

type WebSocketEventCallback = (message: WebSocketMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private callbacks: Map<string, WebSocketEventCallback[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor(url: string = 'ws://localhost:3001') {
    this.url = url;
  }

  connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket соединение установлено');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Ошибка парсинга WebSocket сообщения:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket соединение закрыто:', event.code, event.reason);
          this.isConnecting = false;
          this.ws = null;
          
          // Автоматическое переподключение
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            setTimeout(() => {
              this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };

        this.ws.onerror = (error) => {
          console.error('Ошибка WebSocket:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }

  // Подписка на события определенного типа
  on(eventType: string, callback: WebSocketEventCallback): void {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    this.callbacks.get(eventType)!.push(callback);
  }

  // Отписка от событий
  off(eventType: string, callback: WebSocketEventCallback): void {
    const callbacks = this.callbacks.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Подписка на обновления конкретной сессии
  subscribeToSession(sessionId: string, callback: WebSocketEventCallback): void {
    this.on('session_update', (message) => {
      if (message.sessionId === sessionId) {
        callback(message);
      }
    });

    this.on('transaction_detected', (message) => {
      if (message.sessionId === sessionId) {
        callback(message);
      }
    });

    this.on('transaction_confirmed', (message) => {
      if (message.sessionId === sessionId) {
        callback(message);
      }
    });

    this.on('session_expired', (message) => {
      if (message.sessionId === sessionId) {
        callback(message);
      }
    });
  }

  private handleMessage(message: WebSocketMessage): void {
    const callbacks = this.callbacks.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Ошибка в callback WebSocket:', error);
        }
      });
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'DISCONNECTED';
      default: return 'UNKNOWN';
    }
  }
}

export const websocketClient = new WebSocketClient();
export default WebSocketClient;
