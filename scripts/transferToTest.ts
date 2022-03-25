import * as dotenv from "dotenv";
import '@nomiclabs/hardhat-ethers';
import {BridgeBsc, TokenBsc} from "../config"

import  abiBsc from "../abis/bridgeBsc.json"
import tokenBsc from "../abis/TokenBSC.json"
import { ethers } from 'hardhat';
import { parseEther } from "ethers/lib/utils";
import { Contract } from "ethers";

//import abiBsc from "../artifacts/contracts/BridgeBSC.sol/BridgeBsc.json"
//import abiEth from "../artifacts/contracts/BridgeETH.sol/BridgeEth.json"


  

dotenv.config();


let providerBsc = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

let wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", providerBsc);

let contractBsc = new ethers.Contract(BridgeBsc, abiBsc.abi, providerBsc);

//let token = new ethers.Contract()

(async function() {
    let token = new ethers.ContractFactory(tokenBsc.abi, tokenBsc.bytecode, wallet);
    let tokenContract = await token.deploy();




    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abiBsc.abi, abiBsc.bytecode, wallet);

    // Notice we pass in "Hello World" as the parameter to the constructor
    let contract = await factory.deploy(tokenContract.address);

    // The address the Contract WILL have once mined
    // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
    console.log(contract.address);
    // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"

    // The transaction that was sent to the network to deploy the Contract
    // See: https://ropsten.etherscan.io/tx/0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51
    console.log(contract.deployTransaction.hash);
    // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed()
    let contractWithSigner = contract.connect(wallet);
    
    let tx = await contractWithSigner.functions.swap("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", parseEther("50"), 1,2,25);
    

    // Done! The contract is deployed.
})();


