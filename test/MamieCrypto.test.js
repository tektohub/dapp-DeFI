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
  const lpProvider = accounts[1];
  const oneMillion = new BN(1000000);
  const oneHundred = new BN(100000);

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

    console.log(`USDC pair:${usdcPairAddress}`);
  });

  describe("Test1", async () => {
    it("Check erc20 supply", async () => {
      expect(await cfUSDC.balanceOf(owner)).to.be.bignumber.equal(oneMillion);
      expect(await cfUSDT.balanceOf(owner)).to.be.bignumber.equal(oneMillion);
      expect(await cfDAI.balanceOf(owner)).to.be.bignumber.equal(oneMillion);
    });

    it("send weth and assets to lpProvider", async () => {
      await cWETH.deposit({ from: lpProvider, value: new BN(80) });
      expect(await cWETH.balanceOf(lpProvider)).to.be.bignumber.equal(
        new BN(80)
      );

      await cfUSDC.transfer(lpProvider, oneHundred);
      expect(await cfUSDC.balanceOf(lpProvider)).to.be.bignumber.equal(
        oneHundred
      );

      await cfUSDT.transfer(lpProvider, oneHundred);
      expect(await cfUSDT.balanceOf(lpProvider)).to.be.bignumber.equal(
        oneHundred
      );

      await cfDAI.transfer(lpProvider, oneHundred);
      expect(await cfDAI.balanceOf(lpProvider)).to.be.bignumber.equal(
        oneHundred
      );
    });

    it("mint LP tokens", async () => {
      // approve
      await cfUSDC.approve(cRouter02.address, new BN(200), {
        from: lpProvider,
      });
      // await cfUSDT.approve(cRouter02.address, new BN(200), {
      //   from: lpProvider,
      // });
      // await cfDAI.approve(cRouter02.address, new BN(200), {
      //   from: lpProvider,
      // });
      await cWETH.approve(cRouter02.address, new BN(1), {
        from: lpProvider,
      });

      const [amountToken, amountETH, liquidity] = await cRouter02.addLiquidity(
        cfUSDC.address, //tokenA
        cWETH.address, // tokenB
        new BN(200), // amountADesired
        new BN(1), // amountBDesired
        0, // amountTokenMin
        0, // amountETHMin
        lpProvider, // to
        constants.MAX_UINT256, // deadline
        { from: lpProvider }
      );

      console.log(
        `AmountToken:${amountToken} - AmountETH:${amountETH} - liquidity:${liquidity}`
      );
    });
  });
});
