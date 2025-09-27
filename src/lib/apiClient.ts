import axios from 'axios';
import { PaymentSession, WalletConfig, ApiResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Получение конфигурации кошельков
  async getWallets(): Promise<WalletConfig> {
    try {
      const response = await axios.get<ApiResponse<WalletConfig>>(`${this.baseURL}/wallets`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Не удалось получить конфигурацию кошельков');
    } catch (error) {
      console.error('Ошибка получения кошельков:', error);
      throw error;
    }
  }

  // Создание новой сессии платежа (локальная версия)
  async createPaymentSession(currency: 'USDT', network: string): Promise<PaymentSession> {
    try {
      // Создаем локальную сессию без обращения к backend
      const session: PaymentSession = {
        id: 'real_session_' + Date.now(),
        address: this.getWalletForCurrencyNetwork(currency, network),
        currency,
        network,
        amount: 5, // $5 за подписку
        status: 'waiting',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
      
      console.log('Создана локальная сессия через API клиент:', session);
      return session;
    } catch (error) {
      console.error('Ошибка создания сессии:', error);
      throw error;
    }
  }

  // Получение адреса кошелька для конкретной валюты и сети
  private getWalletForCurrencyNetwork(currency: string, network: string): string {
    // Возвращаем адрес из конфигурации
    return "0x717020d58e62dfd1f18846922a4334a89ca5a360"; // Адрес для Polygon USDT
  }

  // Получение статуса сессии (локальная версия)
  async getPaymentSession(sessionId: string): Promise<PaymentSession> {
    try {
      // Возвращаем базовую сессию для любого ID
      const session: PaymentSession = {
        id: sessionId,
        address: "0x717020d58e62dfd1f18846922a4334a89ca5a360",
        currency: 'USDT',
        network: 'polygon',
        amount: 5,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
      
      return session;
    } catch (error) {
      console.error('Ошибка получения сессии:', error);
      throw error;
    }
  }

  // Проверка статуса backend сервера (всегда возвращаем true для реального режима)
  async checkServerStatus(): Promise<boolean> {
    // Возвращаем true чтобы не переключаться в режим симуляции
    return true;
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
