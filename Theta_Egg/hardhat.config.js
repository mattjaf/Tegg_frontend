/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-truffle5")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")


require('dotenv').config()

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL || "https://eth-kovan.alchemyapi.io/v2/your-api-key"
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || process.env.ALCHEMY_POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.g.alchemyapi.io/v2/your-api-key"
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY || "Your polyscan API key"
// optional
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your private key"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            blockGasLimit: 100000000429720, // whatever you want here
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            // accounts: [PRIVATE_KEY],
            accounts: {
                mnemonic: MNEMONIC,
            },
            saveDeployments: true,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            // accounts: [PRIVATE_KEY],
            accounts: {
                mnemonic: MNEMONIC,
            },
            saveDeployments: true,
            chainId: 4,
        },
        ganache: {
            url: 'http://localhost:8545',
            accounts: {
                mnemonic: MNEMONIC,
            }
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            // accounts: [PRIVATE_KEY],
            accounts: {
                mnemonic: MNEMONIC,
            },
            saveDeployments: true,
        },
        theta_mainnet: {
            url: 'https://eth-rpc-api.thetatoken.org/rpc',
            // accounts: [PRIVATE_KEY_THETA],
            // accounts: {
            //    mnemonic: MNEMONIC_THETA,
            //  },
            saveDeployments: true,
        },
        theta_testnet: {
            blockGasLimit: 100000000429720,
            url: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
            accounts: [PRIVATE_KEY],
            // accounts: {
            //    mnemonic: 'tiger age off bottom leader only ball lonely lonely require food fiction',
            // },
            saveDeployments: true,
        },
        theta_privatenet: {
            url: 'http://localhost:18888/rpc',
            // accounts: [PRIVATE_KEY_THETA],
            // accounts: {
            //     mnemonic: MNEMONIC_THETA,
            //},
            saveDeployments: true,
        },
        polygon: {
            url: POLYGON_RPC_URL || "https://rpc-mainnet.maticvigil.com/",
            // accounts: [PRIVATE_KEY],
            // accounts: {
            //     mnemonic: MNEMONIC,
            // },
            saveDeployments: true,
        },
        mumbai: {
            blockGasLimit: 100000000429720,
            url: "https://matic-mumbai.chainstacklabs.com",
            accounts: [PRIVATE_KEY],
            //accounts: {
            //   mnemonic: MNEMONIC,
            // },
            chainId: 80001,
            saveDeployments: true,
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY
    },
    polyscan: {
        // Your API key for Etherscan
        // Obtain one at https://polygonscan.com/
        apiKey: POLYSCAN_API_KEY
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        feeCollector: {
            default: 1
        }
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7"
            },
            {
                version: "0.8.4"
            },
            {
                version: "0.8.0"
            },
            {
                version: "0.7.0"
            },
            {
                version: "0.6.6"
            },
            {
                version: "0.4.24"
            }
        ]
    },
    mocha: {
        timeout: 100000
    }
}

