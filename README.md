# Solana Multi-Wallet Trading Dashboard

A professional, clean dashboard for coordinated trading across 7 Solana wallets simultaneously.

## Features

✅ **Synchronized Trading**: Buy/Sell the same amount across all 7 wallets with one click  
✅ **Smart Fee Calculation**: Auto-calculates Solana network fees and MEV bribes  
✅ **Percentage-Based Selling**: Sell a percentage across all wallets proportionally  
✅ **Real-Time Balances**: Monitor all wallet balances in real-time  
✅ **Transaction History**: Track all trades and transactions  
✅ **Professional UI**: Clean, modern glass-morphism design  
✅ **Token Search**: Search and select any SPL token by mint address  

## Getting Started

### Prerequisites
- Node.js 18+
- Helius RPC API key (https://www.helius.dev)
- 7 Solana wallets with private keys

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/TrustLayerSOL/solana-multi-wallet-dashboard
   cd solana-multi-wallet-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your Helius API key and wallet private keys in `.env.local`

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Setting Up Your Wallets

To add your wallet private keys:

1. Export your private key from your Solana wallet (e.g., Phantom)
2. Convert it to a JSON array format:
   ```bash
   # If you have the private key in bytes
   echo [123, 45, 67, ...] > wallet_key.json
   ```
3. Add to `.env.local`:
   ```
   WALLET_1_PRIVATE_KEY=[123, 45, 67, ...]
   ```

### Getting Helius API Key

1. Go to https://www.helius.dev
2. Sign up for free
3. Create a new API key
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
   NEXT_PUBLIC_HELIUS_API_KEY=YOUR_KEY
   ```

## Usage

### Dashboard Overview

- **Total Balance**: Sum of all 7 wallets
- **Average Balance**: SOL per wallet
- **Active Wallets**: Number of connected wallets
- **Status**: Current connection status

### Trading

#### Buy Mode (Fixed Amount)
1. Enter token mint address
2. Enter amount in SOL (will be divided equally across wallets)
3. Click "Execute Buy"
4. Confirm transaction

#### Sell Mode

**Fixed Amount:**
1. Click toggle to "Fixed Mode"
2. Enter amount in SOL per wallet
3. Click "Execute Sell"
4. Confirm transaction

**Percentage Mode:**
1. Click toggle to "% Mode"
2. Enter percentage (e.g., 25 for 25%)
3. Each wallet sells 25% of their holdings
4. Click "Execute Sell"
5. Confirm transaction

### Transaction History

All trades are tracked with:
- Transaction type (Buy/Sell)
- Token address
- Amount
- Timestamp
- Status (Pending/Completed/Failed)
- Wallet involved

## Architecture

```
solana-multi-wallet-dashboard/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global Tailwind styles
├── components/
│   ├── Header.tsx            # Top navigation
│   ├── WalletOverview.tsx    # Balance summary cards
│   ├── TradePanel.tsx        # Buy/Sell interface
│   ├── WalletList.tsx        # Connected wallets display
│   └── TransactionHistory.tsx # Trade history log
├── lib/
│   ├── store.ts              # Zustand state management
│   ├── solana.ts             # Solana utilities & RPC calls
│   ├── trading.ts            # Trading calculations & execution
│   └── jupiter.ts            # Jupiter API integration
└── Configuration files
```

## Technology Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Glass Morphism
- **Blockchain**: Solana Web3.js + SPL Token
- **DEX Integration**: Raydium SDK
- **RPC Provider**: Helius
- **State Management**: Zustand
- **UI Components**: Lucide React Icons
- **Charts**: Recharts

## Security

⚠️ **IMPORTANT SECURITY NOTES:**

- Never commit `.env.local` to version control
- Keep private keys secure and never share them
- Use environment variables only for sensitive data
- Test on devnet first before mainnet trading
- This dashboard should only be used on trusted networks
- Consider running on a secure, isolated machine

## Gas Fees & MEV Protection

The dashboard automatically calculates:
- Base transaction fee: ~0.00025 SOL
- MEV bribe for Jupiter: ~0.001 SOL
- Slippage buffer: ~0.002 SOL

Total additional cost per trade: ~0.003 SOL per wallet

## Troubleshooting

### Wallets Not Loading
- Ensure all private keys are in the correct JSON array format
- Check that `.env.local` file exists and is not in `.gitignore`
- Verify Helius RPC URL is correct

### Trades Not Executing
- Ensure all wallets have SOL for gas fees
- Check token mint address is valid
- Verify sufficient liquidity on Raydium

### Connection Issues
- Verify Helius API key is correct
- Check internet connection
- Try switching RPC endpoints

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Setup
1. Set up `.env.local` on your production server
2. Ensure strict file permissions on `.env.local`
3. Use a process manager (PM2, systemd) to keep the service running
4. Consider running behind a reverse proxy (nginx)

## API Integration Status

- ✅ Wallet loading and balance tracking
- ✅ SPL token balance queries
- ✅ Transaction history storage
- ⏳ Jupiter API swap execution (in progress)
- ⏳ Real-time price feeds (in progress)
- ⏳ Advanced analytics (planned)

## Contributing

This is a personal trading tool. Contributions are welcome but please test thoroughly before submitting.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the Troubleshooting section
2. Review Helius documentation: https://docs.helius.dev
3. Check Solana docs: https://docs.solana.com

---

**Disclaimer**: This tool is provided as-is. Trading crypto involves risk. Test thoroughly on devnet before using on mainnet. The developers are not responsible for any losses.
