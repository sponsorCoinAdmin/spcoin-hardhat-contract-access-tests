import hre from "hardhat";
import { assert } from 'chai';
import { deployWETH9Contract, getWeth9Contract, getDeployedArtifactsAbiAddress } from "../lib/TS/deployContract";
import { HHAccountRateMethods } from "../lib/TS/hhAccountRateMethods";

let WETH9ContractDeployed:any;
let hHAccountRateMethods:any;
let signer:any;
let ethers:any = hre.ethers;

describe("WETH9 Contract Deployed", function () {
  beforeEach(async () => {
    WETH9ContractDeployed = await deployWETH9Contract();
    signer = WETH9ContractDeployed.signer;
    hHAccountRateMethods = new HHAccountRateMethods();
    await hHAccountRateMethods.initHHAccounts()
});

  it("1. <TYPE SCRIPT> VALIDATE HARDHAT IS ACTIVE WITH ACCOUNTS", async function () {
    hHAccountRateMethods.dump()
    console.log(`signer.address = ${signer.address}`)

    // Validate 20 HardHat Accounts created
    assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS.length, 20);
    // Validate Active signer Account is Account 0

    console.log(`hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address = ${hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address}`)
    console.log(`WETH9ContractDeployed.signer.address.toLowerCase() = ${WETH9ContractDeployed.signer.address}`)
    // Validate the Signer
    assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[0].address, WETH9ContractDeployed.signer.address);
    // Validate the Last Account
    assert.equal(hHAccountRateMethods.SPONSOR_ACCOUNT_KEYS[19], "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
  });

  // ToDo: BROKE FIX
  it("2. <TYPE SCRIPT> VALIDATE DEPLOYED CONTRACT BY GETTING SIGNER and TEST ACCOUNT[5] BALANCE_OF", async function () {
    const initialBalance:bigint = 10000000000000000000000n;
    const account5 = hHAccountRateMethods.SPONSOR_ACCOUNT_SIGNERS[5];
    const signerBalance:bigint = await ethers.provider.getBalance(signer.address);
    const account5Balance:bigint = await ethers.provider.getBalance(account5.address);

    // All Accounts have been given an ETH Balance of 10000000000000000000000 except the signer account.
    // The signer account (account[0]) balance is less because gas was used for initial setup of hard hat.
    console.log(`1. signer(${signer.address}) Balance = ${signerBalance}`);
    console.log(`2. account[5](${account5}) Balance = ${account5Balance}`);

    assert.isTrue(signerBalance < initialBalance, `ERROR: signerBalance(${signerBalance}) Not Less Than initialBalance(${initialBalance})` );
    assert.equal(account5Balance, initialBalance);
  });

  it("3. <TYPE SCRIPT> Wrap ETH Using Deployed WETH Contract with Sinner account[0]", async function () {
    const signedWeth = WETH9ContractDeployed.connect(signer);
    const wrapEthAmount = ethers.utils.parseEther("2");
    const wrapWeiAmount = "5";

    let beforeEthBalance:bigint = await ethers.provider.getBalance(signer.address);
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
    const { abi:weth9ABI, address:weth9_Address }= await getDeployedArtifactsAbiAddress("WETH9");
    const signedWeth = new ethers.Contract(weth9_Address, weth9ABI, signer);

    const wrapEthAmount = ethers.utils.parseEther("2");
    const wrapWeiAmount = "5";

    let beforeEthBalance:bigint = await ethers.provider.getBalance(signer.address);
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
    const signedWeth = await getWeth9Contract(signer);

    const wrapEthAmount = ethers.utils.parseEther("2");

    let beforeEthBalance:bigint = await ethers.provider.getBalance(signer.address);
    let signerWethBalance = await signedWeth.balanceOf(signer.address)

    console.log(`1. BEFORE WRAP: signer(${signer.address}) ETH Balance = ${beforeEthBalance}`);
    console.log(`2. BEFORE WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);

    let tx = await signedWeth.deposit({value: wrapEthAmount})
    // console.log(`tx = ${JSON.stringify(tx,null,2)}`);

    signerWethBalance = await signedWeth.balanceOf(signer.address)
    let afterEthBalance = await ethers.provider.getBalance(signer.address);

    console.log(`3. AFTER WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);
    console.log(`4. AFTER WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
    console.log(`5. AFTER WRAP: Wrap Gas Fees = ${(beforeEthBalance - afterEthBalance) - signerWethBalance}`);

    await signedWeth.withdraw(ethers.utils.parseEther("1"));
    signerWethBalance = await signedWeth.balanceOf(signer.address)
    afterEthBalance = await ethers.provider.getBalance(signer.address);

    console.log(`6. AFTER UN-WRAP WETH9Contract signer($signerWethBalance}) WETH Balance = ${signerWethBalance}`);
    console.log(`7. AFTER UN-WRAP: signer(${signer.address}) ETH Balance = ${afterEthBalance}`);
  });
});
