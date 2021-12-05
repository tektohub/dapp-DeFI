const {BN} = require("@openzeppelin/test-helpers");

const MamieCryptoV2Factory = artifacts.require("MamieCryptoV2Factory");
// const MamieCryptoV2Pair = artifacts.require("MamieCryptoV2Pair");
const MamieCryptoV2Router02 = artifacts.require("MamieCryptoV2Router02");
const fUSDC = artifacts.require("fUSDC");
const fUSDT = artifacts.require("fUSDT");
const fDAI = artifacts.require("fDAI");
const WETH = artifacts.require("WETH");

const oneMilliard = new BN(1000000000)

module.exports = async function(deployer, network, addresses) {
    await deployer.deploy(fUSDC, oneMilliard);
    await deployer.deploy(fUSDT, oneMilliard);
    await deployer.deploy(fDAI, oneMilliard);
    await deployer.deploy(WETH);

    const fUSDCContract = await fUSDC.deployed()
    const fUSDTContract = await fUSDT.deployed()
    const fDAIContract = await fDAI.deployed()
    const WETHCContract = await WETH.deployed()

    await deployer.deploy(MamieCryptoV2Factory, addresses[0] )
    factoryContract = await MamieCryptoV2Factory.deployed()

    await deployer.deploy(MamieCryptoV2Router02, factoryContract.address, WETHCContract.address)
    routerContract = await MamieCryptoV2Router02.deployed()

    await factoryContract.createPair(fUSDCContract.address, WETHCContract.address);
    usdcPairAddress = await factoryContract.getPair(fUSDCContract.address, WETHCContract.address);
    console.log(`USDC pair:${usdcPairAddress}`);

    await factoryContract.createPair(fUSDTContract.address, WETHCContract.address);
    usdtPairAddress = await factoryContract.getPair(fUSDTContract.address, WETHCContract.address);
    console.log(`USDT pair:${usdtPairAddress}`);

    await factoryContract.createPair(fDAIContract.address, WETHCContract.address);
    daiPairAddress = await factoryContract.getPair(fDAIContract.address, WETHCContract.address);
    console.log(`DAI pair:${daiPairAddress}`);

};  
