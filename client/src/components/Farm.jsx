import React, { useEffect, useState, useRef } from "react";
import Masterchef from "../contracts/MasterChef.json";
import MamieCryptoPair from "../contracts/MamieCryptoV2Pair.json";
import { BN } from "@openzeppelin/test-helpers";

function Farm({ state, pool, index, masterchef }) {
  const [isApproved, setIsApproved] = useState(false);
  const depositInput = useRef();
  const [lpInstance, setLpInstance] = useState(null);
  const [balance, setBalance] = useState(0);

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
        let bal = await lpInstance.methods
          .balanceOf(state.accounts[0])
          .call();
        setBalance(bal)
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

  return (
    <div>
      {pool.lpToken} - {pool.allocPoint} - your balance: {balance / 1e18}
      {!isApproved ? (
        <button onClick={handleApprove}>approve</button>
      ) : (
        <div>
          <input type="text" ref={depositInput}></input>
          <button onClick={handleDeposit}>deposit</button>
        </div>
      )}
    </div>
  );
}

export default Farm;
