const Web3 = require('web3');
const {BN, constants} = require("@openzeppelin/test-helpers");
const MamieCryptoV2Factory = artifacts.require("MamieCryptoV2Factory");
const MamieCryptoV2Router02 = artifacts.require("MamieCryptoV2Router02");
const MamieCryptoV2Pair = artifacts.require("MamieCryptoV2Pair");
const fUSDC = artifacts.require("fUSDC");
const fUSDT = artifacts.require("fUSDT");
const fDAI = artifacts.require("fDAI");
const WETH9 = artifacts.require("WETH9");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const fs = require('fs');

const oneMillion = new BN(web3.utils.toWei("1000000", "ether"))

const getWeb3 = () => {
  return new Web3(new HDWalletProvider(
    `${process.env.MNEMONIC}`,
    `http://127.0.0.1:8545`,
    0
  ));
};

const script = async () => {
  // const web3 = getWeb3();
  const web3 = getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MamieCryptoV2Factory.networks[networkId];
  const accounts = await web3.eth.getAccounts();

  const factory = new web3.eth.Contract(
    MamieCryptoV2Factory.abi,
    MamieCryptoV2Factory.networks[networkId].address
  );

  const router = new web3.eth.Contract(
    MamieCryptoV2Router02.abi,
    MamieCryptoV2Router02.networks[networkId].address
  );

  const fUSDCContract = new web3.eth.Contract(
    fUSDC.abi,
    fUSDC.networks[networkId].address
  );

  const fUSDTContract = new web3.eth.Contract(
    fUSDT.abi,
    fUSDT.networks[networkId].address
  );

  const fDAIContract = new web3.eth.Contract(
    fDAI.abi,
    fDAI.networks[networkId].address
  );

  const WETHCContract = new web3.eth.Contract(
    WETH9.abi,
    WETH9.networks[networkId].address
  );

  //Create Pairs
  await factory.methods
    .createPair(fUSDCContract._address, WETHCContract._address)
    .send({from: accounts[0]});
  usdcPairAddress = await factory.methods
    .getPair(fUSDCContract._address, WETHCContract._address)
    .call();
  console.log(`USDC pair:${usdcPairAddress}`);
  const pair0 = new web3.eth.Contract(
    MamieCryptoV2Pair.abi,
    usdcPairAddress
  );

  await factory.methods
    .createPair(fUSDTContract._address, WETHCContract._address)
    .send({from: accounts[0]});
  usdtPairAddress = await factory.methods
    .getPair(fUSDTContract._address, WETHCContract._address)
    .call();
  console.log(`USDT pair:${usdtPairAddress}`);
  const pair1 = new web3.eth.Contract(
    MamieCryptoV2Pair.abi,
    usdtPairAddress
  );

  await factory.methods
    .createPair(fDAIContract._address, WETHCContract._address)
    .send({from: accounts[0]});
  daiPairAddress = await factory.methods
    .getPair(fDAIContract._address, WETHCContract._address)
    .call();
  console.log(`DAI pair:${daiPairAddress}`);
  const pair2 = new web3.eth.Contract(
    MamieCryptoV2Pair.abi,
    daiPairAddress
  );

  //Save pairs to JSON file
  const jsonData = {
    "LP_fUSDC_WETH_address": usdcPairAddress,
    "LP_fUSDT_WETH_address": usdtPairAddress,
    "LP_fDAI_WETH_address": daiPairAddress, 
  }

  fs.writeFile("pairsAddresses.json", JSON.stringify(jsonData), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
  });


  //approvals
  await fUSDCContract.methods
    .approve(router._address, new BN(oneMillion))
    .send({from: accounts[0]});
  await fUSDTContract.methods
    .approve(router._address, new BN(oneMillion))
    .send({from: accounts[0]});
  await fDAIContract.methods
    .approve(router._address, new BN(oneMillion))
    .send({from: accounts[0]});

  //Add liquidities
  await router.methods
    .addLiquidityETH(
      fUSDCContract._address, 
      new BN(100000),
      0,
      0,
      accounts[0],
      constants.MAX_UINT256)
    .send({from: accounts[0], value: new BN(200000)});
  
    let r = await pair0.methods.getReserves().call()
    console.log('PAIR USDC/ETH:')
    console.log(`Reserve token 0: ${r._reserve0}`)
    console.log(`Reserve token 1: ${r._reserve1}`)

  await router.methods
    .addLiquidityETH(
      fUSDTContract._address, 
      new BN(100000),
      0,
      0,
      accounts[0],
      constants.MAX_UINT256)
    .send({from: accounts[0], value: new BN(300000)});
  
    r = await pair1.methods.getReserves().call()
    console.log('PAIR USDT/ETH:')
    console.log(`Reserve token 0: ${r._reserve0}`)
    console.log(`Reserve token 1: ${r._reserve1}`)
  
  await router.methods
    .addLiquidityETH(
      fDAIContract._address, 
      new BN(100000),
      0,
      0,
      accounts[0],
      constants.MAX_UINT256)
    .send({from: accounts[0], value: new BN(400000)});
  
    r = await pair2.methods.getReserves().call()
    console.log('PAIR DAI/ETH:')
    console.log(`Reserve token 0: ${r._reserve0}`)
    console.log(`Reserve token 1: ${r._reserve1}`)
  
};

module.exports = () => {
  script()
}