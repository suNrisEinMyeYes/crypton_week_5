import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import { BridgeEth } from "../config"

dotenv.config();

task("redeem", "get tokens")
.addParam("to", "The account's address")
.addParam("amount", "amount of money to accept")
.addParam("chainFrom", "")
.addParam("chainTo", "")
.addParam("nonce", "random value")

.setAction(async (taskArgs, hre) => {
  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.API_URL) 
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : [], provider)

  const myContract = await hre.ethers.getContractAt('BridgeEth', BridgeEth, signer)
  const out = await myContract.swap(taskArgs.to, taskArgs.amount, taskArgs.chainFrom, taskArgs.chainTo, taskArgs.nonce);
  console.log(out)
});