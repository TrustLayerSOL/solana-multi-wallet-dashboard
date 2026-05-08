'use client';

import { useDashboardStore } from '@/lib/store';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function WalletList() {
  const { wallets, error } = useDashboardStore();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyAddress = (address: string, walletId: number) => {
    navigator.clipboard.writeText(address);
    setCopiedId(walletId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-bold">Connected Wallets</h2>
      </div>

      {/* Wallet Connection Status */}
      {wallets.length === 0 ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-300">No wallets connected</p>
            <p className="text-red-400 text-xs mt-1">Configure private keys in .env.local and restart</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-solana-green/10 border border-solana-green/30 rounded-lg">
            <p className="text-xs text-solana-green font-semibold">
              ✓ {wallets.length} of 7 wallets connected
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="glass-hover p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-300">Wallet {wallet.id}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1 break-all">
                      {wallet.publicKey.toString()}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-lg font-bold text-solana-green">{wallet.balance.toFixed(3)}</p>
                    <p className="text-xs text-gray-400">SOL</p>
                  </div>
                </div>
                <button
                  onClick={() => copyAddress(wallet.publicKey.toString(), wallet.id)}
                  className="mt-2 w-full text-xs bg-white/5 hover:bg-white/10 px-3 py-2 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedId === wallet.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-solana-green" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
