const { expect } = require("chai");
const { initHHAccounts } = require("./hhTestAccounts");
const { } = require("./deployContract");
const { } = require("../../../prod/spCoinMethods");

sPCoinTestConnect = async () => {
  spCoinContractDeployed = await deploySpCoinContract();
  return spCoinContractDeployed;
}

initSPCoinHHTest = async () => {
  hhTestElements = await initHHAccounts();
  SPONSOR_ACCOUNT_SIGNERS = hhTestElements.signers;
  SPONSOR_ACCOUNT_KEYS = RECIPIENT_ACCOUNT_KEYS = AGENT_ACCOUNT_KEYS = hhTestElements.accounts;
  TRANSACTION_QTY = RECIPIENT_RATES = AGENT_RATES = hhTestElements.rates;
  BURN_ACCOUNT = hhTestElements.burnAddress;
}

initSPCoinTestConnect = async () => {
  spCoinContractDeployed = await sPCoinTestConnect();
  await spCoinConnectMethods(spCoinContractDeployed);
  await initSPCoinHHTest();
};