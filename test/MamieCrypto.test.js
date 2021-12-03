// erc20s
const fUSDC = artifacts.require("fUSDC");
const fUSDT = artifacts.require("fUSDT");
const fDAI = artifacts.require("fDAI");
const WETH9 = artifacts.require("WETH9");

// MamieCryptoSwap
const MamieCryptoV2Factory = artifacts.require("MamieCryptoV2Factory");
const IMamieCryptoV2Pair = artifacts.require("IMamieCryptoV2Pair");
const MamieCryptoV2Router02 = artifacts.require("MamieCryptoV2Router02");

const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("MamieCryptoSwap", (accounts) => {
  const owner = accounts[0];
  const oneMillion = new BN(1000000);

  let cfUSDC, cfUSDT, cfDAI;

  before(async () => {
    cfUSDC = await fUSDC.new({ from: owner, initialSupply: oneMillion });
  });

  describe("Test1", async () => {
    it("Check erc20 supply", async () => {
      expect(cfUSDC.balanceOf(owner)).to.be.big.number.equal(oneMillion);
    });
  });
});
