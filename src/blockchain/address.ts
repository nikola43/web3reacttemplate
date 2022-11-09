export const SupportedChainId = {
  // BSC
  EWC_MAINNET: 246,
  EWC_TESTNET: 73799,
  EWC_HEX_MAINNET: "0xF6",
  EWC_HEX_TESTNET: "0x12047",
};

export const EnergySolarAddress = {
  [SupportedChainId.EWC_HEX_MAINNET]: "0x6DBE77E639BD7FB4635B2AA75aE6a9E8686Dd8E3",
  [SupportedChainId.EWC_HEX_TESTNET]: "0x6DBE77E639BD7FB4635B2AA75aE6a9E8686Dd8E3",
};

export default module.exports = {
  SupportedChainId,
  EnergySolarAddress
};
