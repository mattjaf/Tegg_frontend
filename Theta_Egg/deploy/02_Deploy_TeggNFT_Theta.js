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

    const teggNFTTheta = await deploy('TeggNFTTheta', {
        from: deployer,
        log: true
    })
    log(`You have deployed an NFT contract to ${teggNFTTheta.address}`)
    const TeggNFTTheta = await ethers.getContractFactory("TeggNFTTheta")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const teggNFTThetaContract = new ethers.Contract(teggNFTTheta.address, TeggNFTTheta.interface, signer)
    const networkName = networkConfig[chainId]['name']

    log(`Verify with \n yarn hardhat verify --network ${networkName} ${teggNFTTheta.address}`)
    log("Adding egg URI...")
    let tx = await teggNFTThetaContract.addEggSVG(eggSVG)
    await tx.wait(1)
    log("Adding hatch URI...")
    tx = await teggNFTThetaContract.addHatchSVG(hatchSVG)
    await tx.wait(1)
    log("Creating NFT...")
    tx = await teggNFTThetaContract.create()
    await tx.wait(1)
    log(`You've made your ${await teggNFTThetaContract.getTokenCounter()} NFT!`)
    log(`Here is the NFT tokenURI: ${await teggNFTThetaContract.tokenURI(0)}`)
}

module.exports.tags = ['all', 'feed', 'main', 'theta']
