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

    await TokenEthContract.connect(EthTokenOwner).mint(EthTokenUser.getAddress(), parseEther("50"));
    await TokenEthContract.connect(EthTokenOwner).updateAdmin(BridgeEthContract.address)
    await BridgeEthContract.includeToken(TokenEthContract.address, "TNT");
    await BridgeEthContract.setToken(TokenEthContract.address);
    await BridgeEthContract.setValidator(await EthTokenOwner.getAddress());
    //await TokenBscContract.connect(BscTokenOwner).mint(BscTokenOwner.getAddress(), parseEther("50"));




      
    });

    describe("swap and redeem", function () {
      
      it("first swap then redeem", async function () {
        await BridgeEthContract.connect(EthTokenUser).swap(EthTokenOwner.getAddress(), parseEther("20"), 4, 97, 1)
        expect(await TokenEthContract.balanceOf(await EthTokenUser.getAddress())).to.equal(parseEther("30"))
        await expect(BridgeEthContract.connect(EthTokenUser).swap(EthTokenOwner.getAddress(), parseEther("20"), 4, 97, 1)).to.be.revertedWith("transfer already processed")

        let msg = ethers.utils.solidityKeccak256(
          ["address", "address", "uint256", "uint"],
          [await EthTokenUser.getAddress(), await EthTokenOwner.getAddress(), parseEther("20"), 1]
        )
        let signature = await EthTokenOwner.signMessage(ethers.utils.arrayify(msg))
      
        let sig = ethers.utils.splitSignature(signature)
        console.log(sig.v, sig.r, sig.s)


        await BridgeEthContract.connect(EthTokenOwner).redeem(EthTokenUser.getAddress(), EthTokenOwner.getAddress(), parseEther("20"), 1, sig.r, sig.s, sig.v)
        

        await expect(BridgeEthContract.connect(EthTokenOwner).redeem(EthTokenUser.getAddress(), EthTokenOwner.getAddress(), parseEther("20"), 25, sig.r, sig.s, sig.v)).to.be.revertedWith("wrong signature")

        expect(await TokenEthContract.balanceOf(await EthTokenOwner.getAddress())).to.equal(parseEther("20"))
        await expect(BridgeEthContract.connect(EthTokenOwner).redeem(EthTokenUser.getAddress(), EthTokenOwner.getAddress(), parseEther("20"), 1, sig.r, sig.s, sig.v)).to.be.revertedWith("transfer already processed");


      });
      
    });
    describe("setters getters", function () {
      
      it("include exclude tokens and chains", async function () {
        await expect(BridgeEthContract.includeToken(TokenEthContract.address, "TNT")).to.be.revertedWith("already exist");

        await expect(BridgeEthContract.setToken(TokenBscContract.address)).to.be.revertedWith("doesn't exist");

        await BridgeEthContract.excludeToken(TokenEthContract.address);
         expect(await BridgeEthContract.tokens[TokenEthContract.address]).to.equal("");


      });
      
    });

    
});