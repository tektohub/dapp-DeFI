const Web3 = require("web3");
const { BN, constants } = require("@openzeppelin/test-helpers");
const MamieCryptoV2Factory = artifacts.require("MamieCryptoV2Factory");
const MamieCryptoV2Router02 = artifacts.require("MamieCryptoV2Router02");
const MamieCryptoV2Pair = artifacts.require("MamieCryptoV2Pair");
const fUSDC = artifacts.require("fUSDC");
const fUSDT = artifacts.require("fUSDT");
const fDAI = artifacts.require("fDAI");
const WETH9 = artifacts.require("WETH9");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const fs = require('fs');

const oneMillion = new BN(web3.utils.toWei("1000000", "ether"));

const getWeb3 = () => {
  return new Web3(
    new HDWalletProvider(`${process.env.MNEMONIC}`, `http://127.0.0.1:8545`, 0)
  );
};

const script = async () => {
  // const web3 = getWeb3();
  const web3 = getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MamieCryptoV2Factory.networks[networkId];
  const accounts = await web3.eth.getAccounts();

  // ######## Init contracts objects ########
  const factory = new web3.eth.Contract(
    MamieCryptoV2Factory.abi,
    MamieCryptoV2Factory.networks[networkId].address
  );

  const router = new web3.eth.Contract(
    MamieCryptoV2Router02.abi,
    MamieCryptoV2Router02.networks[networkId].address
  );

  const fUSDCContract = new web3.eth.Contract(
    fUSDC.abi,
    fUSDC.networks[networkId].address
  );

  const fUSDTContract = new web3.eth.Contract(
    fUSDT.abi,
    fUSDT.networks[networkId].address
  );

  const fDAIContract = new web3.eth.Contract(
    fDAI.abi,
    fDAI.networks[networkId].address
  );

  const WETHCContract = new web3.eth.Contract(
    WETH9.abi,
    WETH9.networks[networkId].address
  );
  console.log(`############# Contracts Address ##########`);
  console.log(`Factory :${factory._address}`);
  console.log(`Router02 :${router._address}`);
  console.log(`fUSDC :${fUSDCContract._address}`);
  console.log(`fUSDT :${fUSDTContract._address}`);
  console.log(`fDAI :${fDAIContract._address}`);
  console.log(`WETH :${WETHCContract._address}`);

  // ######## Create Pairs ########

  //approvals
  await fUSDCContract.methods
    .approve(router._address, new BN(oneMillion))
    .send({ from: accounts[0] });
  await fUSDTContract.methods
    .approve(router._address, new BN(oneMillion))
    .send({ from: accounts[0] });
  await fDAIContract.methods
    .approve(router._address, new BN(oneMillion))
    .send({ from: accounts[0] });

  await router.methods
    .addLiquidityETH(
      fUSDCContract._address,
      new BN(web3.utils.toWei("40000")),
      0,
      0,
      accounts[0],
      constants.MAX_UINT256
    )
    .send({ from: accounts[0], value: new BN(web3.utils.toWei("1")) });








  // // USDC
  // usdcPairAddress = await factory.methods
  //   .getPair(fUSDCContract._address, WETHCContract._address)
  //   .call();

  // if (usdcPairAddress === constants.ZERO_ADDRESS) {
  //   await factory.methods
  //     .createPair(fUSDCContract._address, WETHCContract._address)
  //     .send({ from: accounts[0] });
  //   usdcPairAddress = await factory.methods
  //     .getPair(fUSDCContract._address, WETHCContract._address)
  //     .call();
  // }

  // const pair0 = new web3.eth.Contract(MamieCryptoV2Pair.abi, usdcPairAddress);

  // // USDT
  // usdtPairAddress = await factory.methods
  //   .getPair(fUSDTContract._address, WETHCContract._address)
  //   .call();

  // if (usdtPairAddress === constants.ZERO_ADDRESS) {
  //   await factory.methods
  //     .createPair(fUSDTContract._address, WETHCContract._address)
  //     .send({ from: accounts[0] });
  //   usdtPairAddress = await factory.methods
  //     .getPair(fUSDTContract._address, WETHCContract._address)
  //     .call();
  // }

  // const pair1 = new web3.eth.Contract(MamieCryptoV2Pair.abi, usdtPairAddress);

  // // DAI
  // daiPairAddress = await factory.methods
  //   .getPair(fDAIContract._address, WETHCContract._address)
  //   .call();

  // if (daiPairAddress === constants.ZERO_ADDRESS) {
  //   await factory.methods
  //     .createPair(fDAIContract._address, WETHCContract._address)
  //     .send({ from: accounts[0] });
  //   daiPairAddress = await factory.methods
  //     .getPair(fDAIContract._address, WETHCContract._address)
  //     .call();
  // }

  // const pair2 = new web3.eth.Contract(MamieCryptoV2Pair.abi, daiPairAddress);

  // console.log(`############# Pair address ##########`);
  // console.log(`USDC pair:${usdcPairAddress}`);
  // console.log(`USDT pair:${usdtPairAddress}`);
  // console.log(`DAI pair:${daiPairAddress}`);

  // //Save pairs to JSON file
  // const jsonData = {
  //   "LP_fUSDC_WETH_address": usdcPairAddress,
  //   "LP_fUSDT_WETH_address": usdtPairAddress,
  //   "LP_fDAI_WETH_address": daiPairAddress, 
  // }

  // fs.writeFile("pairsAddresses.json", JSON.stringify(jsonData), 'utf8', function (err) {
  //   if (err) {
  //       console.log("An error occured while writing JSON Object to File.");
  //       return console.log(err);
  //   }
 
  //   console.log("JSON file has been saved.");
  // });


  

  // console.log(`############# Approve 1 million for each token`);

  // console.log(
  //   `############# Adding liquidities. 10 ETH for 40000$ (4000$/ETH) ##############`
  // );

  // //Add liquidities
  // await router.methods
  //   .addLiquidityETH(
  //     fUSDCContract._address,
  //     new BN(web3.utils.toWei("40000")),
  //     0,
  //     0,
  //     accounts[0],
  //     constants.MAX_UINT256
  //   )
  //   .send({ from: accounts[0], value: new BN(web3.utils.toWei("10")) });

  // let r = await pair0.methods.getReserves().call();
  // let pair0_reserve0, pair0_reserve1;
  // pair0_reserve0 = r._reserve0;
  // pair0_reserve1 = r._reserve1;
  // //console.log(b);

  // console.log("#### PAIR USDC/ETH");
  // console.log(`Reserve token 0: ${web3.utils.fromWei(pair0_reserve0)}`);
  // console.log(`Reserve token 1: ${web3.utils.fromWei(pair0_reserve1)}`);
  // console.log(
  //   `lpTokens in wallet: ${web3.utils.fromWei(
  //     await pair0.methods.balanceOf(accounts[0]).call()
  //   )}`
  // );

  // await router.methods
  //   .addLiquidityETH(
  //     fUSDTContract._address,
  //     new BN(web3.utils.toWei("40000")),
  //     0,
  //     0,
  //     accounts[0],
  //     constants.MAX_UINT256
  //   )
  //   .send({ from: accounts[0], value: new BN(web3.utils.toWei("10")) });

  // r = await pair1.methods.getReserves().call();

  // console.log("#### PAIR USDT/ETH:");
  // console.log(`Reserve token 0: ${web3.utils.fromWei(r._reserve0)}`);
  // console.log(`Reserve token 1: ${web3.utils.fromWei(r._reserve1)}`);
  // console.log(
  //   `lpTokens in wallet: ${web3.utils.fromWei(
  //     await pair1.methods.balanceOf(accounts[0]).call()
  //   )}`
  // );

  // await router.methods
  //   .addLiquidityETH(
  //     fDAIContract._address,
  //     new BN(web3.utils.toWei("40000")),
  //     0,
  //     0,
  //     accounts[0],
  //     constants.MAX_UINT256
  //   )
  //   .send({ from: accounts[0], value: new BN(web3.utils.toWei("10")) });

  // r = await pair2.methods.getReserves().call();
  // //b = await pair2.balanceOf(accounts[0]);

  // console.log("#### PAIR DAI/ETH:");
  // console.log(`Reserve token 0: ${web3.utils.fromWei(r._reserve0)}`);
  // console.log(`Reserve token 1: ${web3.utils.fromWei(r._reserve1)}`);
  // console.log(
  //   `lpTokens in wallet: ${web3.utils.fromWei(
  //     await pair2.methods.balanceOf(accounts[0]).call()
  //   )}`
  // );

  // console.log(`############# Swap 1 ETH for USDC ##############`);
  // let amountOut = await router.methods
  //   .getAmountOut(new BN(web3.utils.toWei("1")), pair0_reserve0, pair0_reserve1)
  //   .call();
  // console.log(`AmountOut (USDC):${web3.utils.fromWei(amountOut)}`);
  // await router.methods
  //   .swapETHForExactTokens(
  //     amountOut, // amountOut
  //     [WETHCContract._address, fUSDCContract._address], // path
  //     accounts[0], // to
  //     constants.MAX_UINT256 // deadline
  //   )
  //   .send({ from: accounts[0], value: new BN(web3.utils.toWei("1")) });
  // console.log("Swap done !");

  // console.log(
  //   `############# Checking reserves for WETH/USDC pool ##############`
  // );
  // r = await pair0.methods.getReserves().call();
  // pair0_reserve0 = r._reserve0;
  // pair0_reserve1 = r._reserve1;

  // console.log(`Reserve token 0: ${web3.utils.fromWei(pair0_reserve0)}`);
  // console.log(`Reserve token 1: ${web3.utils.fromWei(pair0_reserve1)}`);
};

module.exports = () => {
  script();
};
