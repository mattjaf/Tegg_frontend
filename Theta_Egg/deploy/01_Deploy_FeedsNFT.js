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
    // 0x630C18Dbeec8c9226127346857Abca9da530b05F contract with 4 mints
    log("----------------------------------------------------")
    let eggSVG = await fs.readFileSync("./img/SVG/Test-2.svg", { encoding: "utf8" })
    let hatchSVG = await fs.readFileSync("./img/SVG/test-2-22.svg", { encoding: "utf8" })

    const kryptoEggGang = await deploy('KryptoEggGang', {
        from: deployer,
        log: true
    })
    log(`You have deployed an NFT contract to ${kryptoEggGang.address}`)
    const KryptoEggGang = await ethers.getContractFactory("KryptoEggGang")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const kryptoEggGangContract = new ethers.Contract(kryptoEggGang.address, KryptoEggGang.interface, signer)
    const networkName = networkConfig[chainId]['name']

    log(`Verify with \n yarn hardhat verify --network ${networkName} ${kryptoEggGang.address}`)
    log("Adding egg URI...")
    let tx = await kryptoEggGangContract.addEggSVG(eggSVG, { gasLimit: 18000000 })
    await tx.wait(1)
    log("Adding hatch URI...")
    tx = await kryptoEggGangContract.addHatchSVG(hatchSVG, { gasLimit: 18000000 })
    await tx.wait(1)
    log("Creating NFT...")
    tx = await kryptoEggGangContract.create({ gasLimit: 18000000 })
    await tx.wait(1)
    log(`You've made your ${await kryptoEggGangContract.TokenCounter()} NFT!`)
    log(`Here is the NFT tokenURI: ${await kryptoEggGangContract.tokenURI(0)}`)
}

module.exports.tags = ['all', 'feed', 'main', 'mumbai']