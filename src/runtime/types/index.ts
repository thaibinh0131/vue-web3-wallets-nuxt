export interface ChainOption {
  explorer: string;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
}

export enum CHAIN {
  FANTOM_TESTNET = 4002,
  FANTOM_OPERA = 250,
  KOVAN_TESTNET = 42,
  FUSE_TESTNET = 123,
  FUSE_MAINNET = 122,
  AVAX_TESTNET = 43113,
  AVAX_MAINNET = 43114,
  HUOBI_TESTNET = 256,
  HUOBI_MAINNET = 128,
  NAHMII_TESTNET = 5553,
  NAHMII_MAINNET = 5551,
  ROSE_TESTNET = 42261,
  ROSE_MAINNET = 42262,
  CUBE_MAINNET = 1818,
  CUBE_TESTNET = 1819,
  DOGE_TESTNET = 568,
  DOGE_MAINNET = 2000,
  ZKSYNC_TESTNET = 280,
  GOERLI = 5,
  ETHPOW = 10001,
  SKALE_TESNET = 1250011826715177,
  SKALE_TANK_CHAIN_TESTNET = 1019122823,
  SKALE_EUROPA_TESTNET = 476158412,
  SKALE_CALYPSO_TESTNET = 344106930,
  SKALE_TANK_CHAIN_MAINNET = 1494040293,
  SKALE_EUROPA_MAINNET = 2046399126,
  SKALE_CALYPSO_MAINNNET = 1564830818,
  ETH = 1,
  BSC = 56,
}

export type ChainInfo = Record<number, ChainOption>;

export interface InitializeOptions {
  supportedChains: ChainInfo;
  defaultChain: number;
  wcProjectId: string;
  wcRelayUrl?: string;
  onAccountChanged?: (account: string) => void;
  onDisconnect?: () => void;
  onConnect?: (account: string) => void;
  onError?: (error: any) => void
}
