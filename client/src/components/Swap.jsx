import React, { useEffect, useRef, useState } from "react";
import MamieCryptoRouter from "../contracts/MamieCryptoV2Router02.json";
import MamieCryptoFactory from "../contracts/MamieCryptoV2Factory.json";
import USDC from "../contracts/fUSDC.json";
import USDT from "../contracts/fUSDT.json";
import DAI from "../contracts/fDAI.json";
import WETH from "../contracts/WETH9.json";
import { BN, constants } from "@openzeppelin/test-helpers";

function Swap({ state }) {
  const [instance, setInstance] = useState(null);
  const [factory, setFactory] = useState(null);
  const [tokenA, setTokenA] = useState({
    name: "",
    instance: null,
    balance: 0,
    allowance: 0,
  });
  const [tokenB, setTokenB] = useState({
    name: "",
    instance: null,
    balance: 0,
    allowance: 0,
  });
  const tokenAAmount = useRef();
  const tokenBAmount = useRef();
  const [currentPair, setCurrentPair] = useState(0);

  const tokens_contract = {
    USDC: USDC,
    USDT: USDT,
    DAI: DAI,
    ETH: WETH,
  };

  const getContract = async (tokenName) => {
    let TOK = tokens_contract[tokenName];
    const networkId = await state.web3.eth.net.getId();
    const deployedNetwork = TOK.networks[networkId];
    const instanceContract = new state.web3.eth.Contract(
      TOK.abi,
      deployedNetwork && deployedNetwork.address
    );
    return instanceContract;
  };

  useEffect(() => {
    (async () => {
      if (state.web3) {
        const web3 = state.web3;
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MamieCryptoRouter.networks[networkId];
        const inst = new web3.eth.Contract(
          MamieCryptoRouter.abi,
          deployedNetwork && deployedNetwork.address
        );
        setInstance(inst);

        let factoryAddress = await inst.methods.factory().call();
        const factoryInst = new web3.eth.Contract(
          MamieCryptoFactory.abi,
          factoryAddress
        );
        setFactory(factoryInst);
      }
    })();
  }, [state]);

  const updateToken = async (tokenName, pos) => {
    let token;
    if (tokenName === "ETH") {
      let inst = await getContract(tokenName);
      let balance = await state.web3.eth.getBalance(state.accounts[0]);
      let allowance = 1;
      token = {
        name: tokenName,
        instance: inst,
        balance: balance,
        allowance: allowance,
      };
    } else {
      let inst = await getContract(tokenName);
      let balance = await inst.methods.balanceOf(state.accounts[0]).call();
      let allowance = await inst.methods
        .allowance(state.accounts[0], instance._address)
        .call();
      token = {
        name: tokenName,
        instance: inst,
        balance: balance,
        allowance: allowance,
      };
    }
    pos === "A" ? setTokenA(token) : setTokenB(token);
  };

  useEffect(() => {
    (async () => {
      let pair;
      if (tokenA.instance && tokenB.instance) {
        if (tokenA.instance._address < tokenB.instance._address) {
          pair = await factory.methods
            .getPair(tokenA.instance._address, tokenB.instance._address)
            .call();
        } else {
          pair = await factory.methods
            .getPair(tokenB.instance._address, tokenA.instance._address)
            .call();
        }
        setCurrentPair(pair);
      } else {
        setCurrentPair(null);
      }
      console.log(`current pair ${currentPair}`);
    })();
  }, [tokenA, tokenB]);

  const handleClick = async (tokenName, pos) => {
    updateToken(tokenName, pos);
  };

  const handleApprove = (pos) => {
    let inst = pos === "A" ? tokenA.instance : tokenB.instance;
    inst.methods
      .approve(instance._address, new BN(state.web3.utils.toWei("100000000")))
      .send({ from: state.accounts[0] });
  };

  const handleSwap = async () => {
    const latest = await state.web3.eth.getBlockNumber();
    const lastblock = await state.web3.eth.getBlock(latest);
    const timestamp = await lastblock.timestamp;

    if (tokenAAmount.current.value > 0) {
      if (tokenA.name === "ETH") {
        await instance.methods
          .swapExactETHForTokens(
            0,
            [tokenA.instance._address, tokenB.instance._address],
            state.accounts[0],
            timestamp + 12000000
          )
          .send({
            from: state.accounts[0],
            value: new BN(state.web3.utils.toWei(tokenAAmount.current.value)),
          });
      } else if (tokenB.name === "ETH") {
        await instance.methods
          .swapExactTokensForETH(
            state.web3.utils.toWei(tokenAAmount.current.value),
            0,
            [tokenA.instance._address, tokenB.instance._address],
            state.accounts[0],
            timestamp + 12000000
          )
          .send({
            from: state.accounts[0],
          });
      }
    }
    //   let amountOut = await instance.methods
    //     .getAmountOut(
    //       new BN(state.web3.utils.toWei("1")),
    //       pair0_reserve0,
    //       pair0_reserve1
    //     )
    //     .call();
    // }

    //   await router.methods
    //     .swapETHForExactTokens(
    //       amountOut, // amountOut
    //       [WETHCContract._address, fUSDCContract._address], // path
    //       accounts[0], // to
    //       constants.MAX_UINT256 // deadline
    //     )
    //     .send({ from: accounts[0], value: new BN(web3.utils.toWei("1")) });
  };

  const handleLiquidity = async () => {
    if (tokenAAmount.current.value > 0 && tokenBAmount.current.value > 0) {
      if (tokenA.name === "ETH") {
        instance.methods
          .addLiquidityETH(
            tokenB.instance._address,
            new BN(state.web3.utils.toWei(tokenBAmount.current.value)),
            0,
            0,
            state.accounts[0],
            constants.MAX_UINT256
          )
          .send({
            from: state.accounts[0],
            value: new BN(state.web3.utils.toWei(tokenAAmount.current.value)),
          });
      } else if (tokenB.name === "ETH") {
        instance.methods
          .addLiquidityETH(
            tokenA.instance._address,
            new BN(state.web3.utils.toWei(tokenAAmount.current.value)),
            0,
            0,
            state.accounts[0],
            constants.MAX_UINT256
          )
          .send({
            from: state.accounts[0],
            value: new BN(state.web3.utils.toWei(tokenBAmount.current.value)),
          });
      }
    }
  };

  return (
    instance && (
      <>
        <h1>SWAP</h1>
        <div>
          {Object.keys(tokens_contract).map((v) => (
            <button onClick={() => handleClick(v, "A")}>{v}</button>
          ))}
        </div>
        <div>
          {Object.keys(tokens_contract).map((v) => (
            <button onClick={() => handleClick(v, "B")}>{v}</button>
          ))}
        </div>

        {tokenA.instance && (
          <div>
            TokenA: {tokenA.name} - balance: {tokenA.balance / 1e18}
            {tokenA.allowance <= 0 ? (
              <button onClick={() => handleApprove("A")}>approve</button>
            ) : (
              <input type="text" ref={tokenAAmount} />
            )}
          </div>
        )}

        {tokenB.instance && (
          <div>
            TokenB: {tokenB.name} - balance: {tokenB.balance / 1e18}
            {tokenB.allowance <= 0 ? (
              <button onClick={() => handleApprove("B")}>approve</button>
            ) : (
              <input type="text" ref={tokenBAmount} />
            )}
          </div>
        )}
        {tokenB.allowance > 0 && tokenA.allowance > 0 && (
          <button onClick={handleSwap}>Swap!</button>
        )}
        {tokenB.allowance > 0 && tokenA.allowance > 0 && (
          <button onClick={handleLiquidity}>Add Liquidty!</button>
        )}
        {currentPair > 0 && <div>{currentPair}</div>}
        <h1>LIQUIDITY</h1>
      </>
    )
  );
}

export default Swap;
