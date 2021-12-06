# Defi Alyra - Uniswap Fork + Masterchef fork + Stacking

## Install instructions

In the root folder, run `npm install`

Open a console and start your `ganache-cli -b 1` instance

Open a new console and migrate contracts with `truffle migrate`

Then go to script folder with `cd script/` and run the script to simulate workflow, in order :

- **1** : `truffle exec 1_mamieswap.js` (use ctrl+c to leave the script)
- **2** : `truffle exec 2_masterchef.js` (use ctrl+c to leave the script)
- **3** : `truffle exec 3_staking.js` (use ctrl+c to leave the script)
<p>&nbsp;</p>

## Web UI

Go to client/src folder and run `npm install`

Then `npm start` to run your local instance

<p>&nbsp;</p>

# `Code details`

All contracts have been migrated to Solidity 0.8.10

### **Uniswap contracts**

| Uniswap name      | Renamed               |
| ----------------- | :-------------------- |
| UniswapV2ERC20    | MamieCryptoV2ERC20    |
| UniswapV2Factory  | MamieCryptoV2Factory  |
| UniswapV2Pair     | MamieCryptoV2Pair     |
| UniswapV2Router02 | MamieCryptoV2Router02 |

### **Sushi masterchef**

Localted in folder `contracts/MasterChef`, you will find `Masterchef.sol` and `MCTO.sol`

You can stake in it any LP tokens from Uniswap liquidity pools and you will earn MCTO tokens.

Rewards are 10 MCTO / block for all pools.

### **Staking**

Contract is located in `contracts/Staking` folder and called `MCTOBar.sol`

In MCTO bar you can deposit your MCTO tokens and receive stkMCTO. It will accrued more MCTO over time.
