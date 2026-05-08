import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Wallet } from './store';

export const initializeConnection = (): Connection => {
  const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://mainnet.helius-rpc.com';
  return new Connection(rpcUrl, 'confirmed');
};

export const loadWallets = (): Wallet[] => {
  const wallets: Wallet[] = [];
  for (let i = 1; i <= 7; i++) {
    const privateKeyStr = process.env[`WALLET_${i}_PRIVATE_KEY`];
    if (!privateKeyStr) {
      console.warn(`Wallet ${i} private key not found in environment`);
      continue;
    }

    try {
      const privateKeyArray = JSON.parse(privateKeyStr);
      const keypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyArray));
      wallets.push({
        id: i,
        publicKey: keypair.publicKey,
        keypair: keypair,
        balance: 0,
        tokenBalances: {},
      });
    } catch (error) {
      console.error(`Failed to load wallet ${i}:`, error);
    }
  }
  return wallets;
};

export const getWalletBalance = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<number> => {
  const balanceLamports = await connection.getBalance(publicKey);
  return balanceLamports / LAMPORTS_PER_SOL;
};

export const getTokenBalance = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  tokenMint: PublicKey
): Promise<number> => {
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      mint: tokenMint,
    });

    if (accounts.value.length === 0) return 0;

    const balance = accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance || 0;
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return 0;
  }
};

export const calculateTotalFees = (amountInSol: number): number => {
  // Base transaction fee: 0.00025 SOL
  // MEV bribe for Jupiter: ~0.001 SOL
  // Additional slippage buffer: ~0.002 SOL
  const baseFee = 0.00025;
  const mevBribe = 0.001;
  const slippageBuffer = 0.002;
  return baseFee + mevBribe + slippageBuffer;
};

export const validateTokenMint = (mint: string): boolean => {
  try {
    new PublicKey(mint);
    return true;
  } catch {
    return false;
  }
};

export const getTokenMetadata = async (mint: string): Promise<{ symbol: string; name: string } | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!apiKey) return null;

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'get-token-metadata',
        method: 'getAsset',
        params: { id: mint },
      }),
    });

    const data = await response.json();
    if (data.result?.content?.metadata) {
      return {
        symbol: data.result.content.metadata.symbol || 'UNKNOWN',
        name: data.result.content.metadata.name || 'Unknown Token',
      };
    }
  } catch (error) {
    console.error('Failed to fetch token metadata:', error);
  }
  return null;
};
