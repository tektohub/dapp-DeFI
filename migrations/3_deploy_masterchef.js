const { BN, constants } = require("@openzeppelin/test-helpers");

var Masterchef = artifacts.require("MasterChef");
var MCTOToken = artifacts.require("MCTO");
var MCTOBar = artifacts.require("MCTOBar");

const oneMillion = new BN(web3.utils.toWei("1000000", "ether"));

module.exports = async function (deployer, network, addresses) {
  await deployer.deploy(MCTOToken, oneMillion);
  const MCTO = await MCTOToken.deployed();

  await deployer.deploy(
    Masterchef,
    MCTO.address,
    "0xd26c2c8195e1ecb22Fd9a3227A98de3e31cE943a",
    10,
    0,
    1000
  );
  const masterchef = await Masterchef.deployed();
  await deployer.deploy(MCTOBar, MCTO.address);

  const bar = await MCTOBar.deployed();

  await MCTO.setAdmin(masterchef.address);
  await MCTO.setAdmin(bar.address);
};
