import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {  } from "../config";

describe("Token contract", function () {

  let TokenEth;
  let TokenBsc;
  let BridgeBsc;
  let BridgeEth;


  let TokenEthContract : Contract;
  let TokenBscContract : Contract;
  let BridgeBscContract : Contract;
  let BridgeEthContract : Contract;


  let EthTokenOwner : Signer;
  let EthTokenUser : Signer;

  let BscTokenOwner : Signer;
  let BscTokenUser : Signer;

  let BridgeBscOwner : Signer;
  let BridgeEthOwner : Signer;



  beforeEach(async function () {
      


    TokenEth = await ethers.getContractFactory("TokenEth"); 
    [EthTokenOwner, EthTokenUser] = await ethers.getSigners();     
    TokenEthContract = await TokenEth.deploy();

    TokenBsc = await ethers.getContractFactory("TokenBsc"); 
    [BscTokenOwner, BscTokenUser] = await ethers.getSigners();     
    TokenBscContract = await TokenBsc.deploy();

    BridgeBsc = await ethers.getContractFactory("BridgeBsc"); 
    [BridgeBscOwner] = await ethers.getSigners();
    BridgeBscContract = await BridgeBsc.deploy(TokenBscContract.address);

    BridgeEth = await ethers.getContractFactory("BridgeEth"); 
    [BridgeEthOwner] = await ethers.getSigners();
    BridgeEthContract = await BridgeEth.deploy(TokenEthContract.address);



      
    });

    describe("create", function () {
      
      it("upload some tokens", async function () {
       
        


      });
      
    });

    describe("listing", function () {
      
      it("list, cancel, buy", async function () {





      });
      
    });

    describe("auction", function () {
      
      it("initiate cancel finish bid", async function () {
        
        

        

      });
    });

  });