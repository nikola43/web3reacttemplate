const ChainParams = [
  {
    chainId: "0xF6",
    //chainIdHex: "0xF6",
    chainName: "EWC Mainnet",
    nativeCurrency: {
      name: "Energy Web Token",
      symbol: "EWC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.energyweb.org"],
    blockExplorerUrls: ["https://explorer.energyweb.org"]
    //logo: "./sup/bsclogo.png"
  },
  {
    chainId: "0x12047",
    //chainIdHex: "0x12047",
    chainName: "EWC Testnet",
    nativeCurrency: {
      name: "Volta",
      symbol: "VT",
      decimals: 18,
    },
    rpcUrls: ["https://volta-rpc.energyweb.org"],
    blockExplorerUrls: ['https://volta-explorer.energyweb.org']
    //logo: "./sup/bsclogo.png"
  },
];

export default ChainParams;
