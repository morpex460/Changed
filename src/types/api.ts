// Типы для API интеграции

export interface PaymentSession {
  id: string;
  currency: 'USDT';
  network: string;
  walletAddress: string;
  amount: number; // USD
  cryptoAmount: number;
  status: 'waiting' | 'detected' | 'confirmed' | 'expired';
  createdAt: string;
  expiresAt: string;
  transaction?: Transaction;
}

export interface Transaction {
  hash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  confirmations: number;
  requiredConfirmations: number;
  timestamp: string;
  blockNumber?: number;
  status: 'pending' | 'confirmed';
}

export interface WalletConfig {
  USDT: {
    ethereum: string;
    bsc: string;
    tron: string;
    solana: string;
    polygon: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WebSocketMessage {
  type: 'session_update' | 'transaction_detected' | 'transaction_confirmed' | 'session_expired';
  sessionId: string;
  data?: any;
}

// Типы для конвертации между старым и новым форматом
export interface LegacyNetwork {
  id: string;
  name: string;
  fullName: string;
}

export interface NetworkMapping {
  erc20: 'ethereum';
  bep20: 'bsc';
  trc20: 'tron';
  solana: 'solana';
  polygon: 'polygon';
  arbitrum: 'arbitrum';
}
