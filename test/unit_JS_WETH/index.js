const { assert } = require ('chai');
const { HHAccountRateMethods } = require("../lib/hhAccountRateMethods.js");
const { deployWETH9Contract, deploySpCoinContract, getDeployedArtifactsAbiAddress, getWeth9Contract } = require("../lib/deployContract.js");

let ethers = hre.ethers;
let signer;
let weth9Address;
let weth9ABI;
let weth9ContractDeployed;
let hHAccountRateMethods;
let SPONSOR_ACCOUNT_SIGNERS;
let SPONSOR_ACCOUNT_KEYS;
let RECIPIENT_ACCOUNT_KEYS; 
let RECIPIENT_RATES;
let BURN_ADDRESS;

describe("WETH9 Contract Deployed", function () {
  beforeEach(async () => {
    hHAccountRateMethods = new HHAccountRateMethods();
    await hHAccountRateMethods.initHHAccounts()
    SPONSOR_ACCOUNT_SIGNERS = hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS;
    SPONSOR_ACCOUNT_KEYS = hHAccountRateMethods.SPONSOR_ACCOUNT_KEYS;
    RECIPIENT_ACCOUNT_KEYS = hHAccountRateMethods.RECIPIENT_ACCOUNT_KEYS;
    RECIPIENT_RATES = hHAccountRateMethods.RECIPIENT_RATES;
    BURN_ADDRESS =  hHAccountRateMethods.BURN_ADDRESS;
    signer = SPONSOR_ACCOUNT_SIGNERS[0];
    weth9ContractDeployed = await deployWETH9Contract();
    const { address, abi } = await getDeployedArtifactsAbiAddress("WETH9");
    weth9Address = address;
    weth9ABI = abi;
});

  // it("1. <TYPE SCRIPT> VALIDATE HARDHAT IS ACTIVE WITH ACCOUNTS", async function () {
  //   hHAccountRateMethods.dump()
  //   console.log(`signer.address = ${signer.address}`)

  //   // Validate 20 HardHat Accounts created
  //   assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS.length, 20);

  //   // Validate Active signer Account is Account 0
  //   console.log(`hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address = ${hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address}`)
  //   console.log(`weth9ContractDeployed.signer.address.toLowerCase() = ${weth9ContractDeployed.signer.address}`)
  //   // Validate the Signer
  //   assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address, weth9ContractDeployed.signer.address);

  //   // Validate the Last Account
  //   assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_KEYS[19], "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
  // });

  // // ToDo: BROKE FIX
  // xit("2. <TYPE SCRIPT> VALIDATE DEPLOYED CONTRACT BY GETTING SIGNER and TEST ACCOUNT[5] BALANCE_OF", async function () {
  //   const initialBalance = 10000000000000000000000n;
  //   const account5 = hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[5];
  //   const signerBalance = await ethers.provider.getBalance(signer.address);
  //   const account5Balance = await ethers.provider.getBalance(account5.address);

  //   // All Accounts have been given an ETH Balance of 10000000000000000000000 except the signer account.
  //   // The signer account (account[0]) balance is less because gas was used for initial setup of hard hat.
  //   console.log(`1. signer(${signer.address}) Balance = ${signerBalance}`);
  //   console.log(`2. account[5](${account5}) Balance = ${account5Balance}`);

  //   assert.isTrue(signerBalance < initialBalance, `ERROR: signerBalance(${signerBalance}) Not Less Than initialBalance(${initialBalance})` );
  //   assert.equal(account5Balance, initialBalance);
  // });

  // xit("3. <TYPE SCRIPT> Wrap ETH Using Deployed WETH Contract with Sinner account[0]", async function () {
  //   const signedWeth = weth9ContractDeployed.connect(signer);
  //   const wrapEthAmount = ethers.utils.parseEther("2");
  //   const wrapWeiAmount = "5";

  //   let beforeEthBalance = await ethers.provider.getBalance(signer.address);
  //   let signerWethBalance = await signedWeth.balanceOf(signer.address)

  //   console.log(`1. BEFORE WRAP: signer(${signer.address}) ETH Balance = ${beforeEthBalance}`);
  //   console.log(`2. BEFORE WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);

  //   let tx = await signedWeth.deposit({value: wrapEthAmount})
  //   // console.log(`tx = ${JSON.stringify(tx,null,2)}`);
  //   tx = await signedWeth.deposit({value: wrapWeiAmount})
  //   // console.log(`tx = ${JSON.stringify(tx,null,2)}`);

  //   signerWethBalance = await signedWeth.balanceOf(signer.address)
  //   const afterEthBalance = await ethers.provider.getBalance(signer.address);

  //   console.log(`3. AFTER WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);
  //   console.log(`4. AFTER WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
  //   console.log(`5. AFTER WRAP: Wrap Gas Fees = ${(beforeEthBalance - afterEthBalance) - signerWethBalance}`);
  // });

  // it("4. <TYPE SCRIPT> Wrap ETH Using Deployed WETH Address with Sinner account[0]", async function () {
  //   const signedWeth = new ethers.Contract(weth9Address, weth9ABI, signer);
  //   const wrapEthAmount = ethers.utils.parseEther("2");
  //   const wrapWeiAmount = "5";

  //   let beforeEthBalance = await ethers.provider.getBalance(signer.address);
  //   let signerWethBalance = await signedWeth.balanceOf(signer.address)

  //   console.log(`1. BEFORE WRAP: signer(${signer.address}) ETH Balance = ${beforeEthBalance}`);
  //   console.log(`2. BEFORE WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);

  //   let tx = await signedWeth.deposit({value: wrapEthAmount})
  //   // console.log(`tx = ${JSON.stringify(tx,null,2)}`);
  //   tx = await signedWeth.deposit({value: wrapWeiAmount})
  //   // console.log(`tx = ${JSON.stringify(tx,null,2)}`);

  //   signerWethBalance = await signedWeth.balanceOf(signer.address)
  //   const afterEthBalance = await ethers.provider.getBalance(signer.address);

  //   console.log(`3. AFTER WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);
  //   console.log(`4. AFTER WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
  //   console.log(`5. AFTER WRAP: Gas Fees = ${(beforeEthBalance - afterEthBalance) - signerWethBalance}`);
  // });

  class wethMethodsClass {
    constructor(_weth9Address, _weth9ABI, _signer, _dump=true) {
      this.dump=_dump;
      this.action;
      this.beforeEthBalance;
      this.beforeWethBalance;
      this.afterEthBalance;
      this.afterWethBalance;
      this.weiDeductionAmount;
      this.weth9Address = _weth9Address;
      this.weth9ABI = _weth9ABI;
      this._signer = _signer;
      this.signedWeth = new ethers.Contract(weth9Address, weth9ABI, signer);
      console.log(`EXECUTING: wethMethods.constructor this._signer.address  = ${this._signer.address}`);
    }

    initializeDump = async(_address) => {
      if(this.dump) {
        this.beforeEthBalance = await this.ethBalance(_address);
        this.beforeWethBalance = await this.wethBalance(_address);
      }
    }
  
    finalizeDump = async(_address) => {
      if(this.dump) {
        this.afterEthBalance = await this.ethBalance(_address);
        this.afterWethBalance = await this.wethBalance(_address);
        console.log(`==========================================================================================`);
        console.log(`this.beforeEthBalance  = ${this.beforeEthBalance}`);
        console.log(`this.beforeWethBalance = ${this.beforeWethBalance}`);
        console.log(this.action);
        console.log(`this.afterEthBalance   = ${this.afterEthBalance}`);
        console.log(`this.afterWethBalance  = ${this.afterWethBalance}`);
        console.log(`Gas Fee                = ${(this.beforeEthBalance -  this.afterWethBalance) - this.weiDeductionAmount}`);
        console.log(`==========================================================================================`);
      }
    }
  
    depositETH = async (_ethAmount) => {
      await this.initializeDump(this._signer.address);
      this.action = `EXECUTING: wethMethods.depositETH(${_ethAmount})`;
      this.weiDeductionAmount = ethers.utils.parseEther(_ethAmount);
      const tx = await this.signedWeth.deposit({value: this.weiDeductionAmount});
      if(this.dump) {
        this.afterEthBalance = this.ethBalance(this._signer.address);
        this.afterWethBalance = this.wethBalance(this._signer.address);
      //  console.log(`wethMethods.depositETH:tx = ${JSON.stringify(tx,null,2)}`);
      }
      await this.finalizeDump(this._signer.address);
      return tx;
    }

    depositWEI = async (_weiAmount) => {
      await this.initializeDump(this._signer.address);
      this.weiDeductionAmount = _weiAmount;
      this.action = `EXECUTING: wethMethods.depositWEI(${_weiAmount})`;
      const tx = await this.signedWeth.deposit({value: _weiAmount});
      // console.log(`wethMethods.depositWEI:tx = ${JSON.stringify(tx,null,2)}`);
      await this.finalizeDump(this._signer.address);
      return tx;
    }

    withdrawETH = async (_ethAmount) => {
      await this.initializeDump(this._signer.address);
      this.weiDeductionAmount = -ethers.utils.parseEther(_ethAmount);
      this.action = `EXECUTING: wethMethods.withdrawETH(${_ethAmount})`;

      const tx = await this.withdrawWEI(ethers.utils.parseEther(_ethAmount))
      // console.log(`wethMethods.depositETH:tx = ${JSON.stringify(tx,null,2)}`);
      await this.finalizeDump(this._signer.address);
      return tx;
    }

    withdrawWEI = async (_weiAmount) => {
      await this.initializeDump(this._signer.address);
      this.weiDeductionAmount = -_weiAmount;
      this.action = `EXECUTING: wethMethods.withdrawWEI(${_weiAmount})`;

      const tx = await this.signedWeth.withdraw({value: _weiAmount});
      // console.log(`wethMethods.depositWEI:tx = ${JSON.stringify(tx,null,2)}`);
      await this.finalizeDump(this._signer.address);
      return tx;
    }

    ethBalance = async(_address) => {
      let ethBalance = await ethers.provider.getBalance(_address);
      return ethBalance;
    }

    wethBalance = async(_address) => {
      let wethBalance = await this.signedWeth.balanceOf(_address)
      return wethBalance;
    }
  }

  it("5. <TYPE SCRIPT> un-wrap ETH Using Deployed WETH Address with Sinner account[0]", async function () {
    let tx;
    wethMethods = new wethMethodsClass( weth9Address, weth9ABI, signer )

    const signedWeth = await getWeth9Contract(signer);
    const ethStrAmount = "32";
    const wrapEthAmount = ethers.utils.parseEther("2");

    let beforeEthBalance = await wethMethods.ethBalance(signer.address);
    let signerWethBalance = await wethMethods.wethBalance(signer.address);

    console.log(`1. BEFORE WRAP: signer(${signer.address}) ETH Balance = ${beforeEthBalance}`);
    console.log(`2. BEFORE WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);

    tx = await signedWeth.deposit({value: wrapEthAmount})
    
    tx = await wethMethods.depositETH(ethStrAmount)
    
    // console.log(`tx = ${JSON.stringify(tx,null,2)}`);

    signerWethBalance =  await wethMethods.wethBalance(signer.address);
    let afterEthBalance = await wethMethods.ethBalance(signer.address);
    // let afterEthBalance = await ethers.provider.getBalance(signer.address);

    console.log(`3. AFTER WRAP WETH9Contract signer(${signerWethBalance}) WETH Balance = ${signerWethBalance}`);
    console.log(`4. AFTER WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
    console.log(`5. AFTER WRAP: Wrap Gas Fees = ${(beforeEthBalance - afterEthBalance) - signerWethBalance}`);

    await signedWeth.withdraw(ethers.utils.parseEther("1"));
    signerWethBalance = await signedWeth.balanceOf(signer.address)
    afterEthBalance = await ethers.provider.getBalance(signer.address);

    console.log(`6. AFTER UN-WRAP WETH9Contract signer(${signerWethBalance}) WETH Balance = ${signerWethBalance}`);
    console.log(`7. AFTER UN-WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
  });
});
