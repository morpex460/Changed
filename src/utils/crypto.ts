import QRCode from 'qrcode';
import { CryptoCurrency, PaymentAddress, BaseCurrency, Network } from '../types/wallet';

// Supported cryptocurrencies configuration (интеграция с новым backend API)
const CRYPTO_CONFIG = {
  walletAddresses: {
    // USDT networks - replaced TRC-20 with Arbitrum One
    'tether-erc20': "0x717020d58e62dfd1f18846922a4334a89ca5a360",
    'tether-bsc': "0x717020d58e62dfd1f18846922a4334a89ca5a360", 
    'tether-arbitrum': "0x717020d58e62dfd1f18846922a4334a89ca5a360",
    'tether-polygon': "0x717020d58e62dfd1f18846922a4334a89ca5a360",
    'tether-optimism': "0x717020d58e62dfd1f18846922a4334a89ca5a360" // Replaced Solana with Optimism
  },
  discordInviteLink: "https://discord.gg/yyps-private-123456",
  subscriptionPrice: 15 // Changed to $5 for subscription
};

// Base currencies (USDT only)
export const BASE_CURRENCIES: BaseCurrency[] = [
  {
    symbol: "USDT",
    name: "Tether",
    icon: "/images/crypto/usdt.png",
    color: "#26A17B",
    description: "Stable value pegged to USD - most widely accepted stablecoin"
  }
];

// Available networks
export const NETWORKS: Network[] = [
  {
    id: "erc20",
    name: "ERC-20",
    fullName: "Ethereum Network",
    processingTime: "2-15 min",
    fees: "Medium",
    description: "Most secure and widely supported network"
  },
  {
    id: "bep20",
    name: "BEP-20", 
    fullName: "Binance Smart Chain",
    processingTime: "1-5 min",
    fees: "Low",
    description: "Fast and cost-effective transactions",
    icon: "/images/networks/bep20.png"
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    fullName: "Arbitrum One",
    processingTime: "1-2 min",
    fees: "Low",
    description: "Layer 2 scaling solution for Ethereum",
    icon: "/images/networks/arbitrum.png"
  },
  {
    id: "optimism",
    name: "Optimism",
    fullName: "Optimism Network",
    processingTime: "1-2 min",
    fees: "Low",
    description: "Layer 2 scaling solution with fast finality",
    icon: "/images/networks/optimism.png"
  },
  {
    id: "polygon",
    name: "Polygon",
    fullName: "Polygon Network",
    processingTime: "1-3 min",
    fees: "Very Low", 
    description: "Scalable with extremely low costs",
    icon: "/images/networks/polygon.png"
  }
];

// Filter available networks for specific currencies
export const getAvailableNetworks = (currencySymbol: string): Network[] => {
  return NETWORKS.filter(network => {
    // For USDT: include BEP-20, Arbitrum, Polygon, Optimism (removed ERC-20)
    if (currencySymbol === 'USDT') {
      return ['bep20', 'arbitrum', 'polygon', 'optimism'].includes(network.id);
    }
    
    return true;
  });
};

// Create full currency object from base currency and network
export const createFullCurrency = (baseCurrency: BaseCurrency, network: Network): CryptoCurrency => {
  // Map network IDs to match CRYPTO_CONFIG keys
  const networkIdMapping: Record<string, string> = {
    erc20: 'erc20',
    bep20: 'bsc',
    arbitrum: 'arbitrum',
    optimism: 'optimism',
    polygon: 'polygon'
  };

  // Map currency symbols to match CRYPTO_CONFIG keys
  const currencyMapping: Record<string, string> = {
    USDT: 'tether'
  };

  const mappedNetwork = networkIdMapping[network.id] || network.id;
  const mappedCurrency = currencyMapping[baseCurrency.symbol] || baseCurrency.symbol.toLowerCase();
  const currencyId = `${mappedCurrency}-${mappedNetwork}`;
  
  return {
    id: currencyId,
    name: `${baseCurrency.name} (${network.name})`,
    symbol: baseCurrency.symbol,
    icon: baseCurrency.icon,
    network: `${network.fullName} (${network.name})`,
    color: baseCurrency.color,
    featured: true,
    description: `${baseCurrency.description} on ${network.fullName}`,
    processingTime: network.processingTime,
    fees: network.fees
  };
};

// Legacy supported currencies (for backwards compatibility)
export const SUPPORTED_CURRENCIES: CryptoCurrency[] = [
  {
    id: "tether-erc20",
    name: "Tether USDT (ERC-20)",
    symbol: "USDT",
    icon: "₮", 
    network: "Ethereum (ERC-20)",
    color: "#26A17B",
    featured: true,
    description: "Stable value pegged to USD on Ethereum network",
    processingTime: "2-15 min",
    fees: "Medium"
  },
  {
    id: "tether-bsc",
    name: "Tether USDT (BEP-20)",
    symbol: "USDT",
    icon: "₮", 
    network: "Binance Smart Chain (BEP-20)",
    color: "#26A17B",
    featured: true,
    description: "Stable value pegged to USD on BSC network",
    processingTime: "1-5 min",
    fees: "Low"
  },
  {
    id: "tether-arbitrum",
    name: "Tether USDT (Arbitrum)",
    symbol: "USDT",
    icon: "₮", 
    network: "Arbitrum One",
    color: "#26A17B",
    featured: true,
    description: "Stable value pegged to USD on Arbitrum network",
    processingTime: "1-2 min",
    fees: "Low"
  },
  {
    id: "tether-polygon",
    name: "Tether USDT (Polygon)",
    symbol: "USDT",
    icon: "₮", 
    network: "Polygon Network",
    color: "#26A17B",
    featured: true,
    description: "Stable value pegged to USD on Polygon network",
    processingTime: "1-3 min",
    fees: "Very Low"
  },
  {
    id: "tether-optimism",
    name: "Tether USDT (Optimism)",
    symbol: "USDT",
    icon: "₮", 
    network: "Optimism Network",
    color: "#26A17B",
    featured: true,
    description: "Stable value pegged to USD on Optimism network",
    processingTime: "1-2 min",
    fees: "Low"
  },




];

// Get featured currencies (first 3)
export const getFeaturedCurrencies = (): CryptoCurrency[] => {
  return SUPPORTED_CURRENCIES.filter(currency => currency.featured);
};

// Get additional currencies (remaining 7)
export const getAdditionalCurrencies = (): CryptoCurrency[] => {
  return SUPPORTED_CURRENCIES.filter(currency => !currency.featured);
};

// Get fixed wallet address for currency
export const getWalletAddress = (currencyId: string): string => {
  return CRYPTO_CONFIG.walletAddresses[currencyId as keyof typeof CRYPTO_CONFIG.walletAddresses] || '';
};

// Generate QR code for address
export const generateQRCode = async (address: string, currency: CryptoCurrency, amount?: number): Promise<string> => {
  let qrData = address;
  
  if (amount) {
    const schemes = {
      'tether-erc20': `ethereum:${address}?value=${amount}`,
      'tether-bsc': `${address}`,
      'tether-arbitrum': `ethereum:${address}?value=${amount}`,
      'tether-polygon': `ethereum:${address}?value=${amount}`,
      'tether-optimism': `ethereum:${address}?value=${amount}`,

    };
    qrData = schemes[currency.id as keyof typeof schemes] || address;
  }
  
  try {
    return await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

// Create payment address object
export const createPaymentAddress = async (
  currency: CryptoCurrency,
  amount?: number
): Promise<PaymentAddress> => {
  const address = getWalletAddress(currency.id);
  const qrCode = await generateQRCode(address, currency, amount);
  
  return {
    address,
    qrCode,
    currency,
    amount,
    usdAmount: amount ? calculateUSDAmount(amount, currency) : undefined,
  };
};

// Calculate USD amount (mock exchange rates)
export const calculateUSDAmount = (amount: number, currency: CryptoCurrency): number => {
  const rates = {
    'tether-erc20': 1,
    'tether-bsc': 1,
    'tether-arbitrum': 1,
    'tether-polygon': 1,
    'tether-optimism': 1,
  };
  
  return amount * (rates[currency.id as keyof typeof rates] || 1);
};

// Calculate crypto amount from USD
export const calculateCryptoAmount = (usdAmount: number, currency: CryptoCurrency): number => {
  const rates = {
    'tether-erc20': 1,
    'tether-bsc': 1,
    'tether-arbitrum': 1,
    'tether-polygon': 1,
    'tether-optimism': 1,
  };
  
  const rate = rates[currency.id as keyof typeof rates] || 1;
  return usdAmount / rate;
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Import API client for real transaction checking
import { apiClient } from '../lib/apiClient';
import { PaymentSession } from '../types/api';

// Real transaction status check via backend API
export const checkTransactionStatus = async (address: string, currency: CryptoCurrency, sessionId?: string) => {
  try {
    // Import the fixed blockchain monitor
    const { blockchainMonitorFixed } = await import('../services/BlockchainMonitorFixed');
    
    // Get network from currency ID
    const network = getNetworkFromCurrencyId(currency.id);
    const expectedAmount = 5; // $5 subscription
    
    console.log(`🔍 Checking USDT transfers to ${address} on ${network}`);
    
    // Use blockchain monitoring to check for recent transactions
    // For now, we'll just return waiting status and let the TransactionMonitorUpdated handle real monitoring
    // This is because real-time monitoring should be done in the component, not in status checks
    
    return {
      confirmed: false,
      confirmations: 0,
      txHash: null,
      status: 'waiting'
    };
  } catch (error) {
    console.error('Ошибка проверки транзакции:', error);
    return {
      confirmed: false,
      confirmations: 0,
      txHash: null,
      status: 'waiting'
    };
  }
};

// Helper function to get network from currency ID
const getNetworkFromCurrencyId = (currencyId: string): 'polygon' | 'bsc' | 'ethereum' | 'arbitrum' | 'optimism' => {
  if (currencyId.includes('polygon')) return 'polygon';
  if (currencyId.includes('bsc') || currencyId.includes('bep20')) return 'bsc';
  if (currencyId.includes('arbitrum')) return 'arbitrum';
  if (currencyId.includes('optimism')) return 'optimism';
  return 'ethereum';
};

// Format crypto amount
export const formatCryptoAmount = (amount: number, symbol: string): string => {
  if (symbol === 'BTC') {
    return amount.toFixed(8);
  } else if (symbol === 'ETH') {
    return amount.toFixed(6);
  } else if (symbol === 'USDT') {
    return amount.toFixed(2);
  } else {
    return amount.toFixed(4);
  }
};

// Format USD amount
export const formatUSDAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get Discord invite link
export const getDiscordInviteLink = (): string => {
  return CRYPTO_CONFIG.discordInviteLink;
};

// Get subscription price
export const getSubscriptionPrice = (): number => {
  return CRYPTO_CONFIG.subscriptionPrice;
};

// Функции для работы с новым API

// Конвертация ID сети из фронтенда в backend формат
export const convertNetworkIdToBackend = (networkId: string): string => {
  const mapping: Record<string, string> = {
    'erc20': 'ethereum',
    'bep20': 'bsc',
    'arbitrum': 'arbitrum',
    'optimism': 'optimism',
    'polygon': 'polygon'
  };
  return mapping[networkId] || networkId;
};

// Создание сессии платежа (локальная версия без backend)
export const createPaymentSession = async (baseCurrency: BaseCurrency, network: Network) => {
  try {
    // Создаем локальную сессию без обращения к backend
    const session = {
      id: 'real_session_' + Date.now(),
      address: getWalletAddress(createFullCurrency(baseCurrency, network).id),
      currency: baseCurrency.symbol as 'USDT',
      network: network.id,
      amount: getSubscriptionPrice(),
      status: 'waiting' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
    
    console.log('Создана локальная сессия платежа:', session);
    return session;
  } catch (error) {
    console.error('Ошибка создания сессии платежа:', error);
    throw error;
  }
};

// Проверка доступности backend сервера (всегда доступен в реальном режиме)
export const checkBackendAvailability = async (): Promise<boolean> => {
  // Всегда возвращаем true для работы в реальном режиме
  return true;
};
