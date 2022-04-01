let { networkConfig } = require('../helper-hardhat-config')
const { convertToURI } = require('../scripts/convert-to-svg-uri')
const fs = require('fs')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    log("----------------------------------------------------")
    let eggSVG = await fs.readFileSync("./img/svg/thumbsdown.svg", { encoding: "utf8" })
    let hatchSVG = await fs.readFileSync("./img/svg/thumbsup.svg", { encoding: "utf8" })

    const teggNFT = await deploy('TeggNFT', {
        from: deployer,
        log: true
    })
    log(`You have deployed an NFT contract to ${teggNFT.address}`)
    const TeggNFT = await ethers.getContractFactory("TeggNFT")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const teggNFTContract = new ethers.Contract(teggNFT.address, TeggNFT.interface, signer)
    const networkName = networkConfig[chainId]['name']

    log(`Verify with \n yarn hardhat verify --network ${networkName} ${teggNFT.address}`)
    log("Adding egg URI...")
    let tx = await teggNFTContract.addEggSVG(eggSVG)
    await tx.wait(1)
    log("Adding hatch URI...")
    tx = await teggNFTContract.addHatchSVG(hatchSVG)
    await tx.wait(1)
    log("Creating NFT...")
    tx = await teggNFTContract.create()
    await tx.wait(1)
    log(`You've made your ${await teggNFTContract.getTokenCounter()} NFT!`)
    log(`Here is the NFT tokenURI: ${await teggNFTContract.tokenURI(0)}`)
}

module.exports.tags = ['all', 'feed', 'main', 'eth']
