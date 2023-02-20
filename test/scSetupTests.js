const { expect } = require("chai");
const { testHHAccounts } = require("./lib/hhTestAccounts");
const {    
    LOG_MODE,
    setLogDefaults,
    logSetup,
    setLogMode,
    logTestHeader,
    logFunctionHeader,
    logDetail,
    log
    } = require("../test/lib/logging");

const {} = require("../test/lib/scAccountMethods");

let account;
let sponsor;
let agent;
//let scTree[] = {account, sponsor, agent};

logSetup("JAVASCRIPT => Setup Test");

let spCoinContractDeployed;
describe("spCoinContract", function() {
    let spCoinContract;
    let msgSender;
    beforeEach(async() =>  {
        spCoinContract = await hre.ethers.getContractFactory("SPCoin");
        logSetup("JAVASCRIPT => spCoinContract retreived from Factory");

        logSetup("JAVASCRIPT => Deploying spCoinContract to Network");
        spCoinContractDeployed = await spCoinContract.deploy();
        logSetup("JAVASCRIPT => spCoinContract is being mined");

        await spCoinContractDeployed.deployed();
        logSetup("JAVASCRIPT => spCoinContract Deployed to Network");
        msgSender = await spCoinContractDeployed.msgSender();

        setContract(spCoinContractDeployed);
        setLogDefaults();
    });

    it("Deployment should return correct parameter settings", async function () {
        // setLogMode(LOG_MODE.LOG, true);
        // setLogMode(LOG_MODE.LOG_DETAIL, true);
        // setLogMode(LOG_MODE.LOG_TEST_HEADER, true);
        // setLogMode(LOG_MODE.LOG_FUNCTION_HEADER, true);
        // setLogMode(LOG_MODE.LOG_SETUP, true);
        logTestHeader("ACCOUNT DEPLOYMENT");
        let testName         = "sponsorTestCoin";
        let testSymbol       = "SPTest";
        let testDecimals    = 3;
        let testTotalSupply = 10 * 10**testDecimals;
        let testMsgSender   = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        await spCoinContractDeployed.initToken(testName,  testSymbol, testDecimals, testTotalSupply);
        logDetail("JAVASCRIPT => MsgSender = " + msgSender);
        logDetail("JAVASCRIPT => Name      = " + await spCoinContractDeployed.name());
        logDetail("JAVASCRIPT => Symbol    = " + await spCoinContractDeployed.symbol());
        logDetail("JAVASCRIPT => Decimals  = " + await spCoinContractDeployed.decimals());
        logDetail("JAVASCRIPT => balanceOf = " + await spCoinContractDeployed.balanceOf(msgSender));
        expect(await spCoinContractDeployed.msgSender()).to.equal(testMsgSender);
        expect(await spCoinContractDeployed.name()).to.equal(testName);
        expect(await spCoinContractDeployed.symbol()).to.equal(testSymbol);
        let solDecimals = await spCoinContractDeployed.decimals();
        expect(solDecimals).to.equal(testDecimals);
        expect(await spCoinContractDeployed.decimals()).to.equal(testDecimals);
//        expect(await spCoinContractDeployed.balanceOf(msgSender)).to.equal(testTotalSupply);
    });
    it("Account Insertion Validation", async function () {
        logTestHeader("TEST ACCOUNT INSERTION");
        let account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        let recCount = await spCoinContractDeployed.getAccountRecordCount();
        expect(recCount).to.equal(0);
        logDetail("JAVASCRIPT => ** Before Inserted Record Count = " + recCount);
        let isAccountInserted = await spCoinContractDeployed.isAccountInserted(account);
        logDetail("JAVASCRIPT => Address "+ account + " Before Inserted Record Found = " + isAccountInserted);
        await spCoinContractDeployed.insertAccount(account);
        isAccountInserted = await spCoinContractDeployed.isAccountInserted(account);
        logDetail("JAVASCRIPT => Address "+ account + " After Inserted Record Found = " + isAccountInserted);
        recCount = await spCoinContractDeployed.getAccountRecordCount();
        logDetail("JAVASCRIPT => ** After Inserted Record Count = " + await recCount);        
        expect(recCount).to.equal(1);
    });

    it("Insertion 20 Hardhat Accounts for Validation", async function () {
        logTestHeader("ADD MORE HARDHAT ACCOUNTS")
        await insertAccounts(testHHAccounts);

        logDetail("*** RETRIEVE ALL INSERTED RECORDS FROM THE BLOCKCHAIN ***")
        let insertedArrayAccounts = await getInsertedAccounts();
        let testRecCount = testHHAccounts.length;
        let insertedRecCount = insertedArrayAccounts.length;
        expect(testRecCount).to.equal(insertedRecCount);

        for(idx = 0; idx < insertedRecCount; idx++) {
            expect(testHHAccounts[idx]).to.equal(insertedArrayAccounts[idx]);
            account = insertedArrayAccounts[idx];
            logDetail("JAVASCRIPT => Address Retrieved from Block Chain at Index " + idx + "  = "+ account );
        }
       
    });
    
    it("Insert 4 Sponsor Coin Records 1 caaount, 1 sponsor and 2 Agents", async function () {
        logTestHeader("TEST MORE HARDHAT SPONSOR RECORD INSERTIONS")

        logDetail("*** Insert Sponsor to AccountRecord[2] as AccountRecord[5] ***")
        let startRec = 4;
        let endRec = 15;
        await insertAgentAccounts(3, 6, [1, 2]);
        let insertCount = await spCoinContractDeployed.getAccountRecordCount();
        expect(insertCount).to.equal(4);
    });
});
