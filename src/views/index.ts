export const Chains = [
  "eth",
  "btc",
  "sol",
  "sui",
  "ton",
  "aptos",
  "cosmos",
  "tron",
  "bnb",
  "fuse",
  "polygon",
  "fractal",
  "sonic",
  "movement",
  "osmos",
  "sei",
] as const;

type Chain = (typeof Chains)[number];

export const ChainRouteMap: Record<string, Chain> = {
  "eip155:1": "eth",
  "btc:mainnet": "btc",
  "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": "sol",
  "sui:mainnet": "sui",
  "ton:-239": "ton",
  "aptos:mainnet": "aptos",
  "cosmos:cosmoshub-4": "cosmos",
  "tron:mainnet": "tron",
  "eip155:56": "bnb",
  "eip155:122": "fuse",
  "eip155:137": "polygon",
  "fractal:mainnet": "fractal",
  "svm:70000062": "sonic",
  "movement:mainnet": "movement",
  "cosmos:osmosis-1": "osmos",
  "comsos:pacific-1": "sei",
};
