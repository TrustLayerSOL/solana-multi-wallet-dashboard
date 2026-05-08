'use client';

import { useDashboardStore } from '@/lib/store';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TransactionHistory() {
  const { transactions } = useDashboardStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-solana-green" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-solana-green';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-bold">Transaction History</h2>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-sm">No transactions yet</p>
        ) : (
          transactions.slice(0, 20).map((tx) => (
            <div key={tx.id} className="glass-hover p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(tx.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold capitalize">
                      {tx.type} {tx.token.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      Wallet {tx.walletId} • {tx.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="font-semibold text-xs">{tx.amount.toFixed(4)}</p>
                  <p className={`text-xs ${getStatusColor(tx.status)} capitalize`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
