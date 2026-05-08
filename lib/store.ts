import { create } from 'zustand';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';

export interface Wallet {
  id: number;
  publicKey: PublicKey;
  keypair: Keypair;
  balance: number;
  tokenBalances: Record<string, number>;
}

export interface TradeConfig {
  tokenMint: string;
  amount: number;
  isPercentage: boolean;
  type: 'buy' | 'sell';
}

export interface Transaction {
  id: string;
  walletId: number;
  type: 'buy' | 'sell';
  token: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  signature?: string;
}

interface DashboardStore {
  wallets: Wallet[];
  connection: Connection | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  selectedToken: string | null;
  
  // Actions
  setWallets: (wallets: Wallet[]) => void;
  setConnection: (connection: Connection) => void;
  addTransaction: (tx: Transaction) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedToken: (token: string) => void;
  updateWalletBalance: (walletId: number, balance: number) => void;
  updateTokenBalance: (walletId: number, tokenMint: string, balance: number) => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  wallets: [],
  connection: null,
  transactions: [],
  loading: false,
  error: null,
  selectedToken: null,
  
  setWallets: (wallets) => set({ wallets }),
  setConnection: (connection) => set({ connection }),
  addTransaction: (tx) => set((state) => ({
    transactions: [tx, ...state.transactions],
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedToken: (token) => set({ selectedToken: token }),
  updateWalletBalance: (walletId, balance) =>
    set((state) => ({
      wallets: state.wallets.map((w) =>
        w.id === walletId ? { ...w, balance } : w
      ),
    })),
  updateTokenBalance: (walletId, tokenMint, balance) =>
    set((state) => ({
      wallets: state.wallets.map((w) =>
        w.id === walletId
          ? {
              ...w,
              tokenBalances: { ...w.tokenBalances, [tokenMint]: balance },
            }
          : w
      ),
    })),
  clearError: () => set({ error: null }),
}));
