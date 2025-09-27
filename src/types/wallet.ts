export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  network: string;
  color: string;
  featured: boolean;
  description: string;
  processingTime: string;
  fees: string;
}

export interface PaymentAddress {
  address: string;
  qrCode: string;
  currency: CryptoCurrency;
  amount?: number;
  usdAmount?: number;
}

export interface Transaction {
  id: string;
  txHash?: string;
  currency: CryptoCurrency;
  amount: number;
  usdAmount: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  confirmations: number;
  requiredConfirmations: number;
}

export interface PaymentStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface BaseCurrency {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Network {
  id: string;
  name: string;
  fullName: string;
  processingTime: string;
  fees: string;
  description: string;
  icon?: string;
}

export interface WalletState {
  currentStep: number;
  selectedBaseCurrency: BaseCurrency | null;
  selectedNetwork: Network | null;
  selectedCurrency: CryptoCurrency | null;
  paymentAddress: PaymentAddress | null;
  transaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  showAdditionalCurrencies: boolean;
  preventAutoGeneration?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}
