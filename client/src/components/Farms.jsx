import React, { useEffect, useState, useRef } from "react";
import Masterchef from "../contracts/MasterChef.json";
import MamieCryptoPair from "../contracts/MamieCryptoV2Pair.json";
import Farm from "./Farm";

function Farms({ state }) {
  const [instance, setInstance] = useState(null);
  const lpAddress = useRef();
  const rewards = useRef();
  const [pools, setPools] = useState([]);

  useEffect(() => {
    (async () => {
      if (state.web3) {
        const web3 = state.web3;
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Masterchef.networks[networkId];
        const inst = new web3.eth.Contract(
          Masterchef.abi,
          deployedNetwork && deployedNetwork.address
        );
        setInstance(inst);
      }
    })();
  }, [state]);

  const handleAddPool = async () => {
    await instance.methods
      .add(rewards.current.value, lpAddress.current.value, true)
      .send({ from: state.accounts[0] });
  };

  useEffect(() => {
    (async () => {
      if (instance) {
        const poolNumber = await instance.methods.poolLength().call();
        let farmPools = [];
        for (let i = 0; i < poolNumber; i++) {
          let pool = await instance.methods.poolInfo(i).call();
          farmPools.push(pool);
        }
        setPools(farmPools);
      }
    })();
  }, [instance]);

  

  

  return (
    instance && (
      <>
        <div>FARM PAGE: {instance._address}</div>
        <h1>ADD POOLS</h1>
        <label htmlFor="lp token">LP TOKEN</label>
        <input id="lp token" type="text" ref={lpAddress}></input>
        <label htmlFor="rewards">rewards miltiplier</label>
        <input id="rewards" type="text" ref={rewards}></input>
        <button onClick={handleAddPool}>add pool</button>
        <h1>FARMS</h1>
        {pools.map((p, i) => <Farm state={state} pool={p} index={i}masterchef={instance}></Farm> )}
      </>
    )
  );
}

export default Farms;
