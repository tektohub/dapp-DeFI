import getWeb3 from "./getWeb3";
import MasterChefContract from "../build/contracts/MasterChef.json";
import MCTOContract from "../build/contracts/MCTO.json";
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

LP_fUSDC_WETH_address = "";
LP_fUSDT_WETH_address = "";
LP_fDAI_WETH_address = "";

const getWeb3 = () => {
  return new HDWalletProvider(
    `${process.env.MNEMONIC}`,
    `http://127.0.0.1:8545`
  );
};

const script = async () => {
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
