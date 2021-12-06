const Web3 = require('web3');
const MCTOBarContract = artifacts.require('MCTOBar')
const MCTOContract = artifacts.require('MCTO')
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const getWeb3 = () => {
  return new Web3(new HDWalletProvider(
    `${process.env.MNEMONIC}`,
    `http://127.0.0.1:8545`,
    0
  ));
};



const script = async () => {
  const web3 = getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MCTOBarContract.networks[networkId];
  const accounts = await web3.eth.getAccounts();

  const bar = new web3.eth.Contract(
    MCTOBarContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  const MCTO = new web3.eth.Contract(
    MCTOContract.abi,
    MCTOContract.networks[networkId].address
  );

  // APPROVE
  await MCTO.methods
    .approve(bar._address, 1000)
    .send({ from: accounts[0] });
  
  console.log('############# BEFORE STACKING MCTOBAR  ###############')
  console.log(`stkMCTO supply: ${await bar.methods.totalSupply().call()}`)
  console.log(`MCTO into bar: ${await MCTO.methods.balanceOf(bar._address).call()}`)
  console.log(`account MCTO balance: ${await MCTO.methods.balanceOf(accounts[0]).call()}`)
  console.log(`account stkMCTO balance: ${await bar.methods.balanceOf(accounts[0]).call()}`)
  console.log('############# STAKING MCTO INTO MCTOBAR  ###############')
  await bar.methods
    .enter(50)
    .send({ from: accounts[0] });

  console.log(`stkMCTO supply: ${await bar.methods.totalSupply().call()}`)
  console.log(`MCTO into bar: ${await MCTO.methods.balanceOf(bar._address).call()}`)
  console.log(`account MCTO balance: ${await MCTO.methods.balanceOf(accounts[0]).call()}`)
  console.log(`account stkMCTO balance: ${await bar.methods.balanceOf(accounts[0]).call()}`)
  // await MCTO.methods
  //   .setAdmin(bar._address)
  //   .send({ from: accounts[0] });
  // async function timer() {
    await bar.methods
      .mintReward()
      .send({ from: accounts[0] });
    console.log('')
    console.log('############# MINT MCTO INTO BAR  ###############')
    // await MCTO.methods.mint(bar.address, 1000).send({ from: accounts[0] });
    console.log(`stkMCTO supply: ${await bar.methods.totalSupply().call()}`)
    console.log(`MCTO into bar: ${await MCTO.methods.balanceOf(bar._address).call()}`)
    console.log(`account MCTO balance: ${await MCTO.methods.balanceOf(accounts[0]).call()}`)
    console.log(`account stkMCTO balance: ${await bar.methods.balanceOf(accounts[0]).call()}`)
  
    console.log('')
    console.log('############# REMOVE MCTO FROM MCTOBAR  ###############')
    await bar.methods
      .leave(50)
      .send({ from: accounts[0] });
    console.log(`stkMCTO supply: ${await bar.methods.totalSupply().call()}`)
    console.log(`MCTO into bar: ${await MCTO.methods.balanceOf(bar._address).call()}`)
    console.log(`account MCTO balance: ${await MCTO.methods.balanceOf(accounts[0]).call()}`)
    console.log(`account stkMCTO balance: ${await bar.methods.balanceOf(accounts[0]).call()}`)
  // }
  

  
  // setTimeout( timer, 12000);



};

module.exports = () => {
  script()
}