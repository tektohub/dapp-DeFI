import React, { useEffect, useState } from "react"
import Masterchef from "../contracts/MasterChef.json";

function Farms({ state }) {
    const [instance, setInstance] = useState(null)

    useEffect(() => {
        (async()=> {
            if (state.web3) {
                const web3 = state.web3
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Masterchef.networks[networkId];
                const inst = new web3.eth.Contract(
                    Masterchef.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                setInstance(inst)
            }
        })()
    }, [state])

    return (
        instance && <div>FARM PAGE: {instance._address}</div>
    )

}

export default Farms