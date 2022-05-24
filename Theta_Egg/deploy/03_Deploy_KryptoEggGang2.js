let { networkConfig } = require('../helper-hardhat-config')
const fs = require('fs')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let tokenURI = "http://localhost:3000/tokenid0"
    //"https://ipfs.io/ipfs/QmRtVNZuor5uQqnncRUhneTRY1zRfNtFscvf4PfNRwQTfT"
    //"krypto-egg-gang-tokenid-0.nft"
    // "https://doh.pw/?d=krypto-egg-gang-tokenid-0.nft"
    // "https://ipfs.io/ipfs/QmfFBPqjLvnpUrEPzW4bzssPuNh5AWA7WgJ93UiYg8ppjF"
    log("----------------------------------------------------")
    const kryptoEggGang2 = await deploy('KryptoEggGang2', {
        from: deployer,
        log: true
    })
    log(`You have deployed an NFT contract to ${kryptoEggGang2.address}`)
    const KryptoEggGang2 = await ethers.getContractFactory("KryptoEggGang2")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const kryptoEggGang2Contract = new ethers.Contract(kryptoEggGang2.address, KryptoEggGang2.interface, signer)
    const networkName = networkConfig[chainId]['name']
    log(`Verify with \n yarn hardhat verify --network ${networkName} ${kryptoEggGang2.address}`)
    log("Minting NFT")
    tx = await kryptoEggGang2Contract.create(tokenURI, { gasLimit: 18000000 })
    await tx.wait(1)
    log(`You've made your ${await kryptoEggGang2Contract.tokenCounter()} NFT!`)
    log(`Here is the NFT tokenURI: ${await kryptoEggGang2Contract.tokenURI(4)}`)
}

module.exports.tags = ['rinkeby']