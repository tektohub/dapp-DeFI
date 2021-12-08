import React, { useEffect, useState, useRef } from "react";
import Masterchef from "../contracts/MasterChef.json";
import MamieCryptoPair from "../contracts/MamieCryptoV2Pair.json";
import { BN } from "@openzeppelin/test-helpers";

function Farm({ state, pool, index, masterchef }) {
  const [isApproved, setIsApproved] = useState(false);
  const depositInput = useRef();
  const [lpInstance, setLpInstance] = useState(null);
  const [balance, setBalance] = useState(0);
  const [stacked, setStacked] = useState(0);
  const [pendings, setPendings] = useState(0)

  useEffect(() => {
    (async () => {
      let inst = await getContract(pool.lpToken);
      setLpInstance(inst);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (lpInstance) {
        let allowance = await lpInstance.methods
          .allowance(state.accounts[0], masterchef._address)
          .call();
        setIsApproved(allowance > 0);
        let bal = await lpInstance.methods.balanceOf(state.accounts[0]).call();
        setBalance(bal);
        let stkd = await masterchef.methods
          .userInfo(index, state.accounts[0])
          .call();
        setStacked(stkd.amount)
        let pdgs = await masterchef.methods
          .pendingSushi(index, state.accounts[0])
          .call();
        setPendings(pdgs)
      }
    })();
  }, [lpInstance]);

  const getContract = async (contractAddress) => {
    const instanceContract = new state.web3.eth.Contract(
      MamieCryptoPair.abi,
      contractAddress
    );

    return instanceContract;
  };

  const handleApprove = async () => {
    let lpInstance = await getContract(pool.lpToken);
    await lpInstance.methods
      .approve(masterchef._address, "1000000000000")
      .send({ from: state.accounts[0] });
    setIsApproved(true);
  };

  const handleDeposit = async () => {
    await masterchef.methods
      .deposit(index, depositInput.current.value)
      .send({ from: state.accounts[0] });
  };

  const handleWithdraw = async () => {
      await masterchef.methods
        .withdraw(index, depositInput.current.value)
        .send({from: state.accounts[0]})
  }

  return (
    <div>
      <hr />
      LPToken address: {pool.lpToken} <br />
      Allocation: {pool.allocPoint} <br />
      Balance: {balance / 1e18}
      {!isApproved ? (
        <button onClick={handleApprove}>approve</button>
      ) : (
        <div>
          <input type="text" ref={depositInput}></input>
          <button onClick={handleDeposit}>deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
        </div>
      )}{" "}
      Total stacked: {stacked} <br/>
      Pending MCTO: {pendings}
      
    </div>
  );
}

export default Farm;
