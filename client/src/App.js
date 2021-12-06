import React, { useEffect, useState } from "react";
import MamieCryptoRouter from "./contracts/MamieCryptoV2Router02.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function App() {
  const [state, setState] = useState({ web3: null, accounts: null, contract: null });
  
  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MamieCryptoRouter.networks[networkId];
        const instance = new web3.eth.Contract(
          MamieCryptoRouter.abi,
          deployedNetwork && deployedNetwork.address,
        );
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setState({ web3: web3, accounts: accounts, contract: instance });


      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    })();
  }, [])

  return (
    <div className="App">
      { state.contract !== null && <div> MAMIE CRYPTO SWAP! </div>}
    </div>
  );
}
export default App;
