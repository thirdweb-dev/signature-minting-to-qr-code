export const AllChains: number[] = [1, 4, 137, 80001, 250, 43114];

export enum SupportedChainId {
  Mainnet = 1,
  Rinkeby = 4,
  Polygon = 137,
  Mumbai = 80001,
  Fantom = 250,
  Avalanche = 43114,
}

export const SupportedChainIdToNetworkMap = {
  [SupportedChainId.Mainnet]: "mainnet",
  [SupportedChainId.Rinkeby]: "rinkeby",
  [SupportedChainId.Polygon]: "polygon",
  [SupportedChainId.Mumbai]: "mumbai",
  [SupportedChainId.Fantom]: "fantom",
  [SupportedChainId.Avalanche]: "avalanche",
} as const;

export const SupportedChainIdToLabelMap: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  4: "Ethereum Testnet - Rinkeby",
  137: "Polygon Mainnet",
  80001: "Polygon Testnet - Mumbai",
  250: "Fantom Mainnet",
  43114: "Avalanche Mainnet",
};

export type ValueOf<T> = T[keyof T];

export const alchemyUrlMap: Record<SupportedChainId, string> = {
  [SupportedChainId.Mainnet]: `https://main-light.eth.linkpool.io/`,
  [SupportedChainId.Rinkeby]: `https://rinkeby-light.eth.linkpool.io/`,
  [SupportedChainId.Fantom]: "https://rpc.ftm.tools/",
  [SupportedChainId.Avalanche]: "https://api.avax.network/",
  [SupportedChainId.Polygon]: `https://polygon-rpc.com/`,
  [SupportedChainId.Mumbai]: `https://rpc-mumbai.maticvigil.com`,
};
