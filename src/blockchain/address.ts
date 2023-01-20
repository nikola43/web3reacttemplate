export const SupportedChainId = {
  // BSC
  AVALANCHE_MAINNET: 43114,
  AVALANCHE_TESTNET: 43113,
  AVALANCHE_HEX_MAINNET: "0xA86A",
  AVALANCHE_HEX_TESTNET: "0xA869",
};

export const NodeManagerAddress = {
  [SupportedChainId.AVALANCHE_MAINNET]: "0xF193c3090aF70BC86c0c38BEBf349fA39762F6dE",
  [SupportedChainId.AVALANCHE_HEX_TESTNET]: "0xF193c3090aF70BC86c0c38BEBf349fA39762F6dE",
};

export const PonziXAddress = {
  [SupportedChainId.AVALANCHE_MAINNET]: "0x629C4607C42A018E11416BB6f7B6adD3B4F03384",
  [SupportedChainId.AVALANCHE_HEX_TESTNET]: "0x629C4607C42A018E11416BB6f7B6adD3B4F03384",
};

export default module.exports = {
  SupportedChainId,
  NodeManagerAddress,
  PonziXAddress
};

/*
0x629C4607C42A018E11416BB6f7B6adD3B4F03384 Ponzi
NodeManager Proxy Address:  0xF193c3090aF70BC86c0c38BEBf349fA39762F6dE
NodeManager Implementation Address:  0x0fcF7182A8Dad4b670340e789B80Bbb9DaAC8261
*/