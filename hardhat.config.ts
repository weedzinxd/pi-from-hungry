import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    piTestnet: {
      type: "http",
      url: "https://rpc.testnet.minepi.com",
      chainId: 141
    }
  }
};

export default config;
