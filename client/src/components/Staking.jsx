import React, { useEffect, useState } from "react"
import Bar from "../contracts/MCTOBar.json";

function Staking({ state }) {
    const [instance, setInstance] = useState(null)

    useEffect(() => {
        (async()=> {
            if (state.web3) {
                const web3 = state.web3
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Bar.networks[networkId];
                const inst = new web3.eth.Contract(
                    Bar.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                setInstance(inst)
            }
        })()
    }, [state])

    return (
        instance && <div>STAKING PAGE: {instance._address}</div>
    )

}

export default Staking