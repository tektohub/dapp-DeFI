import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Routes,
  // Switch is not used 
  // eslint-disable-next-line
  Switch,
  Route,
  Link
} from "react-router-dom";

import "./App.css";
import Swap from "./components/Swap";
import Farms from "./components/Farms";
import Staking from "./components/Staking";

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

        //const networkId = await web3.eth.net.getId(); // obo - networkId not used - comment it 
        
        // const deployedNetwork = MamieCryptoRouter.networks[networkId];
        // const instance = new web3.eth.Contract(
        //   MamieCryptoRouter.abi,
        //   deployedNetwork && deployedNetwork.address,
        // );
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setState((s) => ({...s, web3: web3, accounts: accounts}));


      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details. Try to connect a wallet`,
        );
        console.error(error);
      }
    })();
  }, [])

  return (
    <div>

    <Router>
    <nav>
        <Link to="/">Swap </Link>
        <Link to="/farms"> Farms </Link>
        <Link to="/staking"> Stake</Link>
    </nav>
      <Routes>
        <Route exact path="/" element={<Swap state={state} />} />
        <Route exact path="farms" element={<Farms state={state} />} />
        <Route exact path="staking" element={<Staking state={state} />} />
      </Routes>
    </Router>
    </div>
  );
}
export default App;
