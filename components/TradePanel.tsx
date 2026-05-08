'use client';

import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/lib/store';
import { calculateFixedAmounts, calculatePercentageAmounts, calculateTotalCost } from '@/lib/trading';
import { validateTokenMint } from '@/lib/solana';
import { ArrowUpRight, ArrowDownLeft, Loader } from 'lucide-react';

interface TradePanelProps {
  type: 'buy' | 'sell';
}

export default function TradePanel({ type }: TradePanelProps) {
  const { wallets, loading, error, setError, clearError, addTransaction } = useDashboardStore();
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const [isPercentage, setIsPercentage] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isValidMint, setIsValidMint] = useState(false);

  useEffect(() => {
    setIsValidMint(tokenMint.length > 0 && validateTokenMint(tokenMint));
  }, [tokenMint]);

  const handleTrade = () => {
    if (!isValidMint) {
      setError('Please enter a valid token mint address');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (type === 'sell' && isPercentage && parseFloat(amount) > 100) {
      setError('Percentage cannot exceed 100%');
      return;
    }
    clearError();
    setConfirmOpen(true);
  };

  const confirmTrade = async () => {
    const numAmount = parseFloat(amount);
    let amountsPerWallet: Record<number, number> = {};

    if (isPercentage) {
      amountsPerWallet = calculatePercentageAmounts(wallets, numAmount, tokenMint);
    } else {
      amountsPerWallet = calculateFixedAmounts(wallets.length, numAmount);
    }

    // Add transactions to history (placeholder)
    wallets.forEach((wallet) => {
      const txAmount = amountsPerWallet[wallet.id];
      if (txAmount > 0) {
        addTransaction({
          id: `${Date.now()}-${wallet.id}`,
          walletId: wallet.id,
          type,
          token: tokenMint,
          amount: txAmount,
          timestamp: new Date(),
          status: 'pending',
        });
      }
    });

    // TODO: Execute actual trades via Jupiter API
    console.log(`Executing ${type} order:`, {
      token: tokenMint,
      amounts: amountsPerWallet,
      isPercentage,
      walletCount: wallets.length,
    });

    setConfirmOpen(false);
    setAmount('');
    setTokenMint('');
  };

  const isBuy = type === 'buy';
  const buttonClass = isBuy ? 'btn-primary' : 'btn-danger';
  const icon = isBuy ? <ArrowDownLeft /> : <ArrowUpRight />;
  const numAmount = amount ? parseFloat(amount) : 0;
  const amountPerWallet = isPercentage ? numAmount : numAmount / wallets.length;
  const costInfo = calculateTotalCost(numAmount, wallets.length);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold">{isBuy ? 'Buy' : 'Sell'} Token</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Token Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Token Mint Address</label>
          <input
            type="text"
            placeholder="Enter token mint address"
            className="input-field"
            value={tokenMint}
            onChange={(e) => setTokenMint(e.target.value)}
          />
          {tokenMint && (
            <p className={`text-xs mt-1 ${isValidMint ? 'text-solana-green' : 'text-red-400'}`}>
              {isValidMint ? '✓ Valid mint address' : '✗ Invalid mint address'}
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">Amount</label>
            {type === 'sell' && (
              <button
                onClick={() => setIsPercentage(!isPercentage)}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
              >
                {isPercentage ? '% Mode' : 'Fixed Mode'}
              </button>
            )}
          </div>
          <input
            type="number"
            placeholder={isPercentage ? 'Enter percentage' : `Enter amount in SOL (per wallet)`}
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0"
          />
          <p className="text-xs text-gray-400 mt-1">
            {isPercentage
              ? 'Each wallet sells their percentage of holdings'
              : `Total across ${wallets.length} wallets: ${(parseFloat(amount || '0') * wallets.length).toFixed(4)} SOL`}
          </p>
        </div>

        {/* Summary */}
        {numAmount > 0 && isValidMint && (
          <div className="bg-white/5 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Per Wallet:</span>
              <span className="font-semibold text-solana-green">
                {isPercentage ? `${amountPerWallet.toFixed(2)}%` : `${amountPerWallet.toFixed(4)} SOL`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Wallets:</span>
              <span className="font-semibold">{wallets.length}</span>
            </div>
            {!isPercentage && (
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-gray-400">Est. Total:</span>
                <span className="font-bold text-gradient">{(numAmount * wallets.length).toFixed(4)} SOL</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleTrade}
            disabled={loading || !amount || !isValidMint}
            className={`flex-1 ${buttonClass} flex items-center justify-center gap-2`}
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            Execute {isBuy ? 'Buy' : 'Sell'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-md">
            <div className="card-header">
              <h3 className="text-lg font-bold">Confirm {isBuy ? 'Buy' : 'Sell'} Order</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-semibold text-gradient uppercase">{type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token:</span>
                  <span className="font-mono text-xs text-gray-300">
                    {tokenMint.slice(0, 8)}...{tokenMint.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount per wallet:</span>
                  <span className="font-semibold text-solana-green">
                    {isPercentage ? `${amountPerWallet.toFixed(2)}%` : `${amountPerWallet.toFixed(4)} SOL`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallets:</span>
                  <span className="font-semibold text-yellow-400">{wallets.length}</span>
                </div>
                {!isPercentage && (
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-gray-400">Total amount:</span>
                    <span className="font-bold text-gradient">{(numAmount * wallets.length).toFixed(4)} SOL</span>
                  </div>
                )}
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-300">
                ⚠️ Review all details carefully before confirming. This action cannot be undone.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTrade}
                  className={`flex-1 ${buttonClass}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
