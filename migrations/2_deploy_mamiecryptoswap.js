const { BN, constants } = require("@openzeppelin/test-helpers");

const MamieCryptoV2Factory = artifacts.require("MamieCryptoV2Factory");
// const MamieCryptoV2Pair = artifacts.require("MamieCryptoV2Pair");
const MamieCryptoV2Router02 = artifacts.require("MamieCryptoV2Router02");
const fUSDC = artifacts.require("fUSDC");
const fUSDT = artifacts.require("fUSDT");
const fDAI = artifacts.require("fDAI");
const WETH = artifacts.require("WETH9");

const oneMillion = new BN(web3.utils.toWei("1000000", "ether"));

module.exports = async function (deployer, network, addresses) {
  await deployer.deploy(fUSDC, oneMillion);
  await deployer.deploy(fUSDT, oneMillion);
  await deployer.deploy(fDAI, oneMillion);
  await deployer.deploy(WETH);

  const WETHCContract = await WETH.deployed();

  await deployer.deploy(MamieCryptoV2Factory, addresses[0]);
  factoryContract = await MamieCryptoV2Factory.deployed();

  await deployer.deploy(
    MamieCryptoV2Router02,
    factoryContract.address,
    WETHCContract.address
  );
};
