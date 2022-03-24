
import Web3 from 'web3';
//import {BridgeEth} from "../artifacts/contracts/BridgeETH.sol/BridgeETH.json" 
//import BridgeBsc from "../artifacts/contracts/BridgeBSC.sol/"
const ArtsBridgeEth = require("../artifacts/contracts/BridgeETH.sol/BridgeETH.json");
const ArtsBridgeBsc = require("../artifacts/contracts/BridgeBSC.sol/BridgeBSC.json");
import {BridgeBsc, BridgeEth} from "../config"

import "../artifacts/build-info/"

const web3Eth = new Web3('https://rinkeby.infura.io/v3/f3edb6b2feec4708aff6c0c8c3d233bf');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  ArtsBridgeEth.abi,
  BridgeEth
  );

const bridgeBsc = new web3Bsc.eth.Contract(
  ArtsBridgeBsc.abi,
  BridgeBsc
  );

bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async (event: { returnValues: { from: any; to: any; amount: any; date: any; nonce: any; signature: any; }; }) => {
  const { from, to, amount, date, nonce, signature } = event.returnValues;

  const tx = bridgeBsc.methods.swap(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
    - nonce ${nonce}
  `);
});