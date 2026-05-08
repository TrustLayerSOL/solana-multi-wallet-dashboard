'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import WalletOverview from '@/components/WalletOverview';
import TradePanel from '@/components/TradePanel';
import WalletList from '@/components/WalletList';
import TransactionHistory from '@/components/TransactionHistory';
import { useDashboardStore } from '@/lib/store';
import { initializeConnection, loadWallets, getWalletBalance } from '@/lib/solana';

export default function Home() {
  const { setConnection, setWallets, setError, updateWalletBalance, wallets } = useDashboardStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize connection
        const connection = initializeConnection();
        setConnection(connection);

        // Load wallets
        const loadedWallets = loadWallets();
        if (loadedWallets.length === 0) {
          setError('No wallets found. Please configure wallet private keys in .env.local');
          return;
        }
        setWallets(loadedWallets);

        // Fetch initial balances
        for (const wallet of loadedWallets) {
          try {
            const balance = await getWalletBalance(connection, wallet.publicKey);
            updateWalletBalance(wallet.id, balance);
          } catch (error) {
            console.error(`Failed to fetch balance for wallet ${wallet.id}:`, error);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Initialization failed');
      }
    };

    initialize();

    // Refresh balances every 30 seconds
    const interval = setInterval(() => {
      initialize();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-solana-darker">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <WalletOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TradePanel type="buy" />
              <TradePanel type="sell" />
            </div>
            <TransactionHistory />
          </div>
          <div>
            <WalletList />
          </div>
        </div>
      </div>
    </main>
  );
}
