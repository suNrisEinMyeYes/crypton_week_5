import * as dotenv from "dotenv";
import '@nomiclabs/hardhat-ethers';
//const ArtsBridgeEth = require("../artifacts/contracts/BridgeETH.sol/BridgeETH.json");
//const ArtsBridgeBsc = require("../artifacts/contracts/BridgeBSC.sol/BridgeBSC.json");
import {BridgeBsc, BridgeEth} from "../config"

import  abiBsc from "../abis/bridgeBsc.json"
import abiEth from "../abis/bridgeEth.json"
import { ethers } from 'hardhat';

//import abiBsc from "../artifacts/contracts/BridgeBSC.sol/BridgeBsc.json"
//import abiEth from "../artifacts/contracts/BridgeETH.sol/BridgeEth.json"


async function listen() {
  

dotenv.config();


let providerBsc = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545")
let providerEth = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/f3edb6b2feec4708aff6c0c8c3d233bf")

let wallet = new ethers.Wallet(process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "")

let contractEth = new ethers.Contract(BridgeEth, abiEth.abi, providerEth)
let contractBsc = new ethers.Contract(BridgeBsc, abiBsc.abi, providerBsc)

console.log((await providerBsc.getNetwork()).chainId)
console.log("sdfsf")
console.log()




contractBsc.on("Transfer", async (from, to, amount, date, nonce, chainFrom, chainTo) => {
  let msg = ethers.utils.solidityKeccak256(
    ["address", "address", "uint256", "uint"],
    [from, to, amount, nonce]
  )
  let signature = await wallet.signMessage(ethers.utils.arrayify(msg))

  let sig = ethers.utils.splitSignature(signature)
  console.log(from, to, amount, nonce, sig.v, sig.r, sig.s)
});

}


listen()



