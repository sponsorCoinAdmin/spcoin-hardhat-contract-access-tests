const { assert } = require ('chai');
const { HHAccountRateMethods } = require("../lib/hhAccountRateMethods.js");
const { deployWETH9Contract, deploySpCoinContract, getDeployedArtifactsABIAddress, getWeth9Contract } = require("../lib/deployContract.js");

// Use one of the 4 library's below. 2 are local development and 2 ard NPM installed

// const { WethMethods,HARDHAT } = require(`../../node_modules_prod/spcoin-weth-module/index`);
// const { WethMethods,HARDHAT } = require(`../../node_modules_prod/spcoin-all-modules/index.js`);
// const { WethMethods,HARDHAT } = require(`@sponsorcoin/spcoin-weth-module/index`);
const { WethMethods,HARDHAT } = require(`@sponsorcoin/spcoin-all-modules/index.js`);

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
    const { address, abi } = await getDeployedArtifactsABIAddress("WETH9");
    weth9Address = address;
    weth9ABI = abi;
});

  it("1. <TYPE SCRIPT> VALIDATE HARDHAT IS ACTIVE WITH ACCOUNTS", async function () {
    hHAccountRateMethods.dump()
    console.log(`signer.address = ${signer.address}`)

    // Validate 20 HardHat Accounts created
    assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS.length, 20);

    // Validate Active signer Account is Account 0
    console.log(`hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address = ${hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address}`)
    console.log(`weth9ContractDeployed.signer.address.toLowerCase() = ${weth9ContractDeployed.signer.address}`)
    // Validate the Signer
    assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address, weth9ContractDeployed.signer.address);

    // Validate the Last Account
    assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_KEYS[19], "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
  });

  // ToDo: BROKE FIX
  it("2. <TYPE SCRIPT> VALIDATE DEPLOYED CONTRACT BY GETTING SIGNER and TEST ACCOUNT[5] BALANCE_OF", async function () {
    const initialBalance = 10000000000000000000000n;
    const account5 = hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[5];
    const signerBalance = await ethers.provider.getBalance(signer.address);
    const account5Balance = await ethers.provider.getBalance(account5.address);

    // All Accounts have been given an ETH Balance of 10000000000000000000000 except the signer account.
    // The signer account (account[0]) balance is less because gas was used for initial setup of hard hat.
    console.log(`1. signer(${signer.address}) Balance = ${signerBalance}`);
    console.log(`2. account[5](${account5}) Balance = ${account5Balance}`);

    assert.isTrue(signerBalance < initialBalance, `ERROR: signerBalance(${signerBalance}) Not Less Than initialBalance(${initialBalance})` );
    assert.equal(account5Balance, initialBalance);
  });

  it("3. <TYPE SCRIPT> Wrap ETH Using Deployed WETH Contract with Sinner account[0]", async function () {
    const signedWeth = weth9ContractDeployed.connect(signer);
    const wrapEthAmount = ethers.utils.parseEther("2");
    const wrapWeiAmount = "5";

    let beforeEthBalance = await ethers.provider.getBalance(signer.address);
    let signerWethBalance = await signedWeth.balanceOf(signer.address)

    console.log(`1. BEFORE WRAP: signer(${signer.address}) ETH Balance = ${beforeEthBalance}`);
    console.log(`2. BEFORE WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);

    let tx = await signedWeth.deposit({value: wrapEthAmount})
    // console.log(`tx = ${JSON.stringify(tx,null,2)}`);
    tx = await signedWeth.deposit({value: wrapWeiAmount})
    // console.log(`tx = ${JSON.stringify(tx,null,2)}`);

    signerWethBalance = await signedWeth.balanceOf(signer.address)
    const afterEthBalance = await ethers.provider.getBalance(signer.address);

    console.log(`3. AFTER WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);
    console.log(`4. AFTER WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
    console.log(`5. AFTER WRAP: Wrap Gas Fees = ${(beforeEthBalance - afterEthBalance) - signerWethBalance}`);
  });

  it("4. <TYPE SCRIPT> Wrap ETH Using Deployed WETH Address with Sinner account[0]", async function () {
    const signedWeth = new ethers.Contract(weth9Address, weth9ABI, signer);
    const wrapEthAmount = ethers.utils.parseEther("2");
    const wrapWeiAmount = "5";

    let beforeEthBalance = await ethers.provider.getBalance(signer.address);
    let signerWethBalance = await signedWeth.balanceOf(signer.address)

    console.log(`1. BEFORE WRAP: signer(${signer.address}) ETH Balance = ${beforeEthBalance}`);
    console.log(`2. BEFORE WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);

    let tx = await signedWeth.deposit({value: wrapEthAmount})
    // console.log(`tx = ${JSON.stringify(tx,null,2)}`);
    tx = await signedWeth.deposit({value: wrapWeiAmount})
    // console.log(`tx = ${JSON.stringify(tx,null,2)}`);

    signerWethBalance = await signedWeth.balanceOf(signer.address)
    const afterEthBalance = await ethers.provider.getBalance(signer.address);

    console.log(`3. AFTER WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);
    console.log(`4. AFTER WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
    console.log(`5. AFTER WRAP: Gas Fees = ${(beforeEthBalance - afterEthBalance) - signerWethBalance}`);
  });

  it("5. <TYPE SCRIPT> un-wrap ETH Using Deployed WETH Address with Sinner account[0]", async function () {
    let tx;
    const ethDepositAmount = "2";
    const ethWithdrawAmount = "1";
    const wethMethods = new WethMethods();
    wethMethods.connect( weth9Address, weth9ABI, signer );

    tx = await wethMethods.depositETH(ethDepositAmount)
    // console.log(`tx(${wethMethods.depositETH(ethDepositAmount)} = ${JSON.stringify(tx,null,2)}`);
    tx = await wethMethods.withdrawETH(ethWithdrawAmount)
    // console.log(`tx(${wethMethods.withdrawETH(ethWithdrawAmount)} = ${JSON.stringify(tx,null,2)}`);
  });

  it("6. <TYPE SCRIPT> wrap/un-wrap ETH Using Deployed WETH Address with Sinner account[2]", async function () {
    let tx;
    const signer = SPONSOR_ACCOUNT_SIGNERS[2];
    const ethDepositAmount = "2";
    const ethWithdrawAmount = "1";
    const wethMethods = new WethMethods();
    wethMethods.connect( weth9Address, weth9ABI, signer );

    tx = await wethMethods.depositETH(ethDepositAmount)
    // console.log(`tx(${wethMethods.depositETH(ethDepositAmount)} = ${JSON.stringify(tx,null,2)}`);
    tx = await wethMethods.withdrawETH(ethWithdrawAmount)
    // console.log(`tx(${wethMethods.withdrawETH(ethWithdrawAmount)} = ${JSON.stringify(tx,null,2)}`);
  });

  it("7. <TYPE SCRIPT> wrap.un-wrap WEI Using Deployed WETH Address with Sinner account[5]", async function () {
    let tx;
    const signer = SPONSOR_ACCOUNT_SIGNERS[5];
    const weiDepositAmount = "2";
    const weiWithdrawAmount = "1";
    const wethMethods = new WethMethods();
    wethMethods.connect( weth9Address, weth9ABI, signer );

    tx = await wethMethods.depositWEI(weiDepositAmount)
    // console.log(`tx(${wethMethods.depositETH(weiDepositAmount)} = ${JSON.stringify(tx,null,2)}`);
    tx = await wethMethods.withdrawWEI(weiWithdrawAmount)
    // console.log(`tx(${wethMethods.withdrawETH(ethWithdrawAmount)} = ${JSON.stringify(tx,null,2)}`);
  });

  it("8. <TYPE SCRIPT> wrap.un-wrap WEI Using Deployed WETH Address with Sinner account[9]", async function () {
    let tx;
    const signer = SPONSOR_ACCOUNT_SIGNERS[9];
    const weiDepositAmount = "2";
    const weiWithdrawAmount = "1";
    const wethMethods = new WethMethods();
    const weth9Address = wethMethods.getWeth9NetworkAddress(HARDHAT);
    const weth9ABI = await wethMethods.getDeployedWeth9ABI()
    // console.log(`weth9ABI = ${weth9ABI}`)

    wethMethods.connect( weth9Address, weth9ABI, signer );

    tx = await wethMethods.depositWEI(weiDepositAmount)
    // console.log(`tx(${wethMethods.depositETH(weiDepositAmount)} = ${JSON.stringify(tx,null,2)}`);
    tx = await wethMethods.withdrawWEI(weiWithdrawAmount)
    // console.log(`tx(${wethMethods.withdrawETH(ethWithdrawAmount)} = ${JSON.stringify(tx,null,2)}`);
  });

  it("9. <TYPE SCRIPT> wrap.un-wrap WEI Using Deployed WETH Address with Sinner account[9]", async function () {
    let tx;
    const signer = SPONSOR_ACCOUNT_SIGNERS[9];
    const weiDepositAmount = "2";
    const weiWithdrawAmount = "1";
    const wethMethods = new WethMethods();
    const { weth9Address, weth9ABI }  = wethMethods.getWeth9DefaultNetworkABIAddress(HARDHAT);

    // console.log(`weth9Address = ${weth9Address}`)
    // console.log(`weth9ABI = ${weth9ABI}`)

    wethMethods.connect( weth9Address, weth9ABI, signer );

    tx = await wethMethods.depositWEI(weiDepositAmount)
    // console.log(`tx(${wethMethods.depositETH(weiDepositAmount)} = ${JSON.stringify(tx,null,2)}`);
    tx = await wethMethods.withdrawWEI(weiWithdrawAmount)
    // console.log(`tx(${wethMethods.withdrawETH(ethWithdrawAmount)} = ${JSON.stringify(tx,null,2)}`);
  });

  it("10. <TYPE SCRIPT> wrap.un-wrap WEI Using connectWeth9DefaultNetwork with HardHat Network and Sinner account[11]", async function () {
    let tx;
    const signer = SPONSOR_ACCOUNT_SIGNERS[11];
    const weiDepositAmount = "2";
    const weiWithdrawAmount = "1";

    const wethMethods = new WethMethods();
    wethMethods.connectWeth9DefaultNetwork( HARDHAT, signer );
    tx = await wethMethods.depositWEI(weiDepositAmount)
    // console.log(`tx(${wethMethods.depositETH(weiDepositAmount)} = ${JSON.stringify(tx,null,2)}`);
    tx = await wethMethods.withdrawWEI(weiWithdrawAmount)
    // console.log(`tx(${wethMethods.withdrawETH(ethWithdrawAmount)} = ${JSON.stringify(tx,null,2)}`);
  });

});
