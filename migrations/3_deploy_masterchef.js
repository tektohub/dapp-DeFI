const { BN, constants } = require("@openzeppelin/test-helpers");

var Masterchef = artifacts.require("MasterChef");
var MCTOToken = artifacts.require("MCTO");
var MCTOBar = artifacts.require("MCTOBar");

const oneMillion = new BN(web3.utils.toWei("1000000", "ether"));

module.exports = async function(deployer, network, addresses) {
  await deployer.deploy(MCTOToken, oneMillion)
  const MCTO = await MCTOToken.deployed()

  await deployer.deploy(
    Masterchef,
    MCTO.address,
    '0xd26c2c8195e1ecb22Fd9a3227A98de3e31cE943a',
    10,
    0,
    1000
  )
  const masterchef = await Masterchef.deployed()
  await deployer.deploy(MCTOBar, MCTO.address)
  
  const bar = await MCTOBar.deployed()
  
  await MCTO.setAdmin(masterchef.address)
  await MCTO.setAdmin(bar.address)

  
  // await MCTO.approve(bar.address, 1000)

  // console.log('############# STAKING MCTO INTO MCTOBAR  ###############')
  // await bar.enter(50)

  // console.log(`stkMCTO supply: ${await bar.totalSupply()}`)
  // console.log(`MCTO into bar: ${await MCTO.balanceOf(bar.address)}`)
  // console.log(`account MCTO balance: ${await MCTO.balanceOf(addresses[0])}`)
  // console.log(`account stkMCTO balance: ${await bar.balanceOf(addresses[0])}`)
  // console.log('')
  // console.log('############# MINT 1000 WEI MCTO INTO BAR  ###############')
  // await MCTO.mint(bar.address, 1000)
  // console.log(`stkMCTO supply: ${await bar.totalSupply()}`)
  // console.log(`MCTO into bar: ${await MCTO.balanceOf(bar.address)}`)
  // console.log(`account MCTO balance: ${await MCTO.balanceOf(addresses[0])}`)
  // console.log(`account stkMCTO balance: ${await bar.balanceOf(addresses[0])}`)

  
  
  // waitAndCall = async () => {
  //   const timer = async () => {
  //     await bar.mintReward()
  //     console.log('')
  //     console.log('############# REMOVE MCTO FROM MCTOBAR  ###############')
  //     await bar.leave(50)
  //     console.log(`stkMCTO supply: ${await bar.totalSupply()}`)
  //     console.log(`MCTO into bar: ${await MCTO.balanceOf(bar.address)}`)
  //     console.log(`account MCTO balance: ${await MCTO.balanceOf(addresses[0])}`)
  //     console.log(`account stkMCTO balance: ${await bar.balanceOf(addresses[0])}`)
  //   }
  
  //   setTimeout( timer, 6000);
  //   return true
  // }


  // await waitAndCall()

};
