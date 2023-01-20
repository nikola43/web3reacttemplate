const ChainParams = [
  {
    chainId: 43114,
    chainIdHex: "0A86A",
    chainName: "Avalanche Mainnet C-Chain",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"]
    //logo: "./sup/bsclogo.png"
  },
  {
    chainId: 43113,
    chainIdHex: "0xA869",
    chainName: "Avalanche Fuji Testnet",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io"]
    //logo: "./sup/bsclogo.png"
  },
];

export default ChainParams;
