import React, { useEffect, useState } from "react"
import MamieCryptoRouter from "../contracts/MamieCryptoV2Router02.json";

function Swap({ state }) {
    const [instance, setInstance] = useState(null)

    useEffect(() => {
        (async()=> {
            if (state.web3) {
                const web3 = state.web3
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = MamieCryptoRouter.networks[networkId];
                const inst = new web3.eth.Contract(
                    MamieCryptoRouter.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                setInstance(inst)
            }
        })()
    }, [state])

    return (
        instance && <div>Swap PAGE: {instance._address}</div>
    )

}

export default Swap