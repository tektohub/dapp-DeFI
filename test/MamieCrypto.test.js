// erc20s
const fUSDC = artifacts.require("fUSDC");
const fUSDT = artifacts.require("fUSDT");
const fDAI = artifacts.require("fDAI");
const WETH9 = artifacts.require("WETH9");

// MamieCryptoSwap
const MamieCryptoV2Factory = artifacts.require("MamieCryptoV2Factory");
const IMamieCryptoV2Pair = artifacts.require("IMamieCryptoV2Pair");
const MamieCryptoV2Router02 = artifacts.require("MamieCryptoV2Router02");

const { expect } = require("chai");
const {
  BN,
  expectRevert,
  expectEvent,
  constants,
} = require("@openzeppelin/test-helpers");

contract("MamieCryptoSwap", (accounts) => {
  const owner = accounts[0];
  const lpProvider = accounts[0];
  const oneMillion = new BN(1000000);

  let cfUSDC, cfUSDT, cfDAI, cWETH;
  let cFactoryV2, cRouter02;
  let usdcPairAddress, usdtPairAddress, daiPairAddress;

  before(async () => {
    cfUSDC = await fUSDC.new(oneMillion, { from: owner });
    cfUSDT = await fUSDT.new(oneMillion, { from: owner });
    cfDAI = await fDAI.new(oneMillion, { from: owner });
    cWETH = await WETH9.new({ from: owner });

    cFactoryV2 = await MamieCryptoV2Factory.new(owner, { from: owner });
    cRouter02 = await MamieCryptoV2Router02.new(
      cFactoryV2.address,
      cWETH.address,
      { from: owner }
    );

    // create pairs XXX/WETH
    // USDC
    await cFactoryV2.createPair(cfUSDC.address, cWETH.address);
    usdcPairAddress = await cFactoryV2.getPair(cfUSDC.address, cWETH.address);
    // USDT
    await cFactoryV2.createPair(cfUSDT.address, cWETH.address);
    usdtPairAddress = await cFactoryV2.getPair(cfUSDT.address, cWETH.address);
    // DAI
    await cFactoryV2.createPair(cfDAI.address, cWETH.address);
    daiPairAddress = await cFactoryV2.getPair(cfDAI.address, cWETH.address);
    // const usdcPair = await IMamieCryptoV2Pair.at(pairAddress1);
    // console.log(await usdcPair.token0.call());
  });

  describe("Test1", async () => {
    it("Check erc20 supply", async () => {
      expect(await cfUSDC.balanceOf(owner)).to.be.bignumber.equal(oneMillion);
      expect(await cfUSDT.balanceOf(owner)).to.be.bignumber.equal(oneMillion);
      expect(await cfDAI.balanceOf(owner)).to.be.bignumber.equal(oneMillion);
    });

    it("mint LP tokens", async () => {
      const [amountToken, amountETH, liquidity] =
        await cRouter02.addLiquidityETH.sendTransaction(
          cfUSDC.address, //token addr
          new BN(1000), // amountTokenDesired
          new BN(1000), // amountTokenMin
          new BN(10), // amountETHMin
          lpProvider.address, // to
          constants.MAX_UINT256 // deadline
        );

      console.log(await usdcPairAddress.balanceOf(lpProvider.address));
    });
  });
});
