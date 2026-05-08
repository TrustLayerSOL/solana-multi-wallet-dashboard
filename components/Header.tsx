'use client';

export default function Header() {
  return (
    <header className="bg-solana-darker border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-solana-purple to-solana-green rounded-lg flex items-center justify-center font-bold text-black">
              ⚡
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">Solana Multi-Wallet</h1>
              <p className="text-sm text-gray-400">Professional Trading Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Network</p>
              <p className="font-semibold text-solana-green">Mainnet</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
