const { BN, constants } = require("@openzeppelin/test-helpers");

var Masterchef = artifacts.require("./MasterChef/MasterChef.sol");
var MCTOToken = artifacts.require("./MasterChef/MCTO.sol");
var MCTOBar = artifacts.require("./MasterChef/MCTOBar.sol");

const oneMillion = new BN(web3.utils.toWei("1000000", "ether"));

module.exports = async function(deployer) {
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

  await deployer.deploy(MCTOBar, MCTO.address)

  const bar = await MCTOBar.deployed()

  MCTO.approve(bar.address, 1000)
  await bar.enter(50)

};
