import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { BridgeEth } from "../config"

dotenv.config();

task("redeem", "get tokens")
.addParam("from", "The account's address")
.addParam("to", "The account's address")
.addParam("amount", "amount of money to accept")
.addParam("nonce", "random value")
.addParam("v", "sig.v")
.addParam("r", "sig.r")
.addParam("s", "sig.s")
.setAction(async (taskArgs, hre) => {
  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.API_URL) 
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : [], provider)

  const myContract = await hre.ethers.getContractAt('BridgeEth', BridgeEth, signer)
  const out = await myContract.redeem(taskArgs.from, taskArgs.to, taskArgs.amount, taskArgs.nonce, taskArgs.r, taskArgs.s, taskArgs.v);
  console.log(out)
});