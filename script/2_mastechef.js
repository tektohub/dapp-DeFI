const Web3 = require('web3');
const MasterChefContract = require('../build/contracts/MasterChef.json')
const MCTOContract = require('../build/contracts/MCTO.json')
// import MasterChefContract from "../build/contracts/MasterChef.json";
// import MCTOContract from "../build/contracts/MCTO.json";
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

LP_fUSDC_WETH_address = "0xa83E7bA00C98BcF23Bf1DcE94559825f5B6DB76A";
LP_fUSDT_WETH_address = "0x8118f142Dff3a95dde31dBbbf25803a1dec960c2";
LP_fDAI_WETH_address = "0x90B7525dB4f3174fC3AC98369a66D800E8aD616B";

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

  const masterChef = web3.eth.Contract(
    MasterChefContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  const MCTO = web3.eth.Contract(
    MCTOContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  masterChef.methods
    .add(3000, LP_fUSDC_WETH_address, true)
    .send({ from: accounts[0] });
  masterChef.methods
    .add(2000, LP_fUSDT_WETH_address, true)
    .send({ from: accounts[0] });
  masterChef.methods
    .add(5000, LP_fDAI_WETH_address, true)
    .send({ from: accounts[0] });
};

module.exports = () => {

  script()
}