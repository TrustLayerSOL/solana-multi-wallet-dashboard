'use client';

import { useDashboardStore } from '@/lib/store';
import { Wallet } from 'lucide-react';

export default function WalletOverview() {
  const { wallets } = useDashboardStore();

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const averageBalance = wallets.length > 0 ? totalBalance / wallets.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Balance</p>
            <p className="text-2xl font-bold text-gradient">{totalBalance.toFixed(2)} SOL</p>
          </div>
          <Wallet className="w-10 h-10 text-solana-purple opacity-50" />
        </div>
      </div>

      <div className="card">
        <div>
          <p className="text-gray-400 text-sm">Average per Wallet</p>
          <p className="text-2xl font-bold text-solana-green">{averageBalance.toFixed(2)} SOL</p>
        </div>
      </div>

      <div className="card">
        <div>
          <p className="text-gray-400 text-sm">Active Wallets</p>
          <p className="text-2xl font-bold text-yellow-400">{wallets.length} / 7</p>
        </div>
      </div>

      <div className="card">
        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-2xl font-bold text-solana-green">Ready</p>
        </div>
      </div>
    </div>
  );
}
