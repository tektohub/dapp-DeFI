const Web3 = require('web3');
const MasterChefContract = require('../build/contracts/MasterChef.json')
const MCTOContract = require('../build/contracts/MCTO.json')
const MamieCryptoPairContract = require ('../build/contracts/MamieCryptoV2Pair.json')
// import MasterChefContract from "../build/contracts/MasterChef.json";
// import MCTOContract from "../build/contracts/MCTO.json";
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

let LP_fUSDC_WETH_address;
let LP_fUSDT_WETH_address;
let LP_fDAI_WETH_address;

var fs = require('fs');
fs.readFile('pairsAddresses.json',
  function(err, data) {       
    const jsonData = data;
    const jsonParsed = JSON.parse(jsonData);
    LP_fUSDC_WETH_address = jsonParsed.LP_fUSDC_WETH_address;
    LP_fUSDT_WETH_address = jsonParsed.LP_fUSDT_WETH_address;
    LP_fDAI_WETH_address = jsonParsed.LP_fDAI_WETH_address;
    console.log(LP_fDAI_WETH_address)
});


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
  const deployedNetwork = MasterChefContract.networks[networkId];
  const accounts = await web3.eth.getAccounts();

  const masterChef = new web3.eth.Contract(
    MasterChefContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  const MCTO = new web3.eth.Contract(
    MCTOContract.abi,
    MCTOContract.networks[networkId].address
  );

  await masterChef.methods
    .add(3000, LP_fUSDC_WETH_address, true)
    .send({ from: accounts[0] });
  await masterChef.methods
    .add(2000, LP_fUSDT_WETH_address, true)
    .send({ from: accounts[0] });
  await masterChef.methods
    .add(5000, LP_fDAI_WETH_address, true)
    .send({ from: accounts[0] });
  
  const poolLenth = await masterChef.methods.poolLength().call()
  console.log(poolLenth)
  
  const pool0 = await masterChef.methods.poolInfo(0).call()
  const pool1 = await masterChef.methods.poolInfo(1).call()
  const pool2 = await masterChef.methods.poolInfo(2).call()

  console.log(`pool0: ${pool0.lpToken} with allocation: ${pool0.allocPoint}`)
  console.log(`pool1: ${pool1.lpToken} with allocation: ${pool1.allocPoint}`)
  console.log(`pool2: ${pool2.lpToken} with allocation: ${pool2.allocPoint}`)

  // test Pool Masterchef
  const usdcEthLP = new web3.eth.Contract(
    MamieCryptoPairContract.abi,
    LP_fUSDC_WETH_address
  )

  await usdcEthLP.methods
    .approve(masterChef._address, 10000000)
    .send({from: accounts[0]});


  console.log(`MCTO on account before deposit: ${await MCTO.methods.balanceOf(accounts[0]).call()}`)
  
  let pendingsPool0 = await masterChef.methods.pendingSushi(0, accounts[0]).call()
  console.log(`Pending rewards on pool USDC/ETH: ${pendingsPool0}`)
  
  console.log('deposit 10 LP Token')
  await masterChef.methods
    .deposit(0, 10) 
    .send({from: accounts[0]});

  pendingsPool0 = await masterChef.methods.pendingSushi(0, accounts[0]).call()
  console.log(`Pending rewards on pool USDC/ETH: ${pendingsPool0}`)
  
  console.log(`MCTO on account after deposit: ${await MCTO.methods.balanceOf(accounts[0]).call()}`)

  

  let info = await masterChef.methods.userInfo(0, accounts[0]).call()
  console.log(`userInfo pool 0: ${info.amount}`)
};

module.exports = () => {
  script()
}