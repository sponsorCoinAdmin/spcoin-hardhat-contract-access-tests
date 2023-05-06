const { } = require("./utils/logging");
const {
  AccountStruct,
  AgentRateStruct,
  AgentStruct,
  RecipientStruct,
  RecipientRateStruct,
  TransactionStruct } = require("./spCoinDataTypes");
const { bigIntToDecString } = require("./utils/serialize");

let spCoinContractDeployed;
let signer;

//////////////////////////// ROOT LEVEL FUNCTIONS ////////////////////////////

injectReadMethodsContract = (_spCoinContractDeployed) => {
  spCoinContractDeployed = _spCoinContractDeployed;
};

injectReadMethodsSigner = (_signer) => {
  signer = _signer;
};

getAccountListSize = async () => {
  logFunctionHeader("getAccountListSize = async()");
  let maxSize = (await getAccountList()).length;
  logDetail("JS => Found " + maxSize + " Account Keys");
  logExitFunction();
  return maxSize;
};

getAccountList = async () => {
  logFunctionHeader("getAccountList = async()");
  let insertedAccountList = await spCoinContractDeployed.connect(signer).getAccountList();
  logExitFunction();
  return insertedAccountList;
};

////////////////////////// ACCOUNT RECORD FUNCTIONS //////////////////////////

getAccountRecords = async() => {
  // console.log("==>1 getAccountRecords()");
  logFunctionHeader("getAccountRecords()");
  let accountArr = [];
  let AccountList = await spCoinContractDeployed.connect(signer).getAccountList();

  for (let i in AccountList) {
      let accountStruct = await getAccountRecord(AccountList[i]);
      accountArr.push(accountStruct);
  }
  logExitFunction();
  return accountArr;
}

getAccountRecord = async (_accountKey) => {
  // console.log("==>2 getAccountRecord = async(", _accountKey,")");
  let accountStruct = await getSerializedAccountRecord(_accountKey);
  accountStruct.accountKey = _accountKey;
  recipientAccountList = await getAccountRecipientKeys(_accountKey);
  accountStruct.recipientRecordList = await getRecipientRecordList(_accountKey, recipientAccountList);
  logExitFunction();
  return accountStruct;
}

getRecipientKeySize = async (_accountKey) => {
  // console.log("==>20 getRecipientKeySize = async(" + _accountKey + ")");
  logFunctionHeader("getRecipientKeySize = async(" + _accountKey + ")");

  let maxSize = (await getAccountRecipientKeys(_accountKey)).length;
  logDetail("JS => Found " + maxSize + " Account Recipient Keys");
  logExitFunction();
  return maxSize;
};

getAccountRecipientKeys = async (_accountKey) => {
  // console.log("==>4 getAccountRecipientKeys = async(" + _accountKey + ")");
  logFunctionHeader("getAccountRecipientKeys = async(" + _accountKey + ")");
  let recipientAccountList = await spCoinContractDeployed.connect(signer).getRecipientKeys(_accountKey);
  logExitFunction();
  return recipientAccountList;
};

/////////////////////// RECIPIENT RECORD FUNCTIONS ///////////////////////

getAgentAccountList = async (_sponsorKey, _recipientKey, _recipientRateKey) => {
  // console.log("==>13 getAgentAccountList = async(" + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ")" );
  logFunctionHeader("getAgentAccountList = async(" + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ")" );
  agentAccountList = await spCoinContractDeployed.connect(signer).getAgentAccountList(_sponsorKey, _recipientKey, _recipientRateKey);
  logExitFunction();
  return agentAccountList;
};

/////////////////////// AGENT RECORD FUNCTIONS ////////////////////////

getSerializedAccountRecord = async (_accountKey) => {
  // console.log("==>3 getSerializedAccountRecord = async(" + _accountKey + ")");
  logFunctionHeader("getSerializedAccountRecord = async(" + _accountKey + ")");
  let serializedAccountRec =
    await spCoinContractDeployed.connect(signer).getSerializedAccountRecord(_accountKey);
    logExitFunction();
  return deSerializedAccountRec(serializedAccountRec);
};

//////////////////// LOAD ACCOUNT DATA //////////////////////
getRecipientsByAccount = async(_accountKey) => {    
  logFunctionHeader("getRecipientsByAccount = async("  + _accountKey + ")");
  recipientAccountList = await getAccountRecipientKeys(_accountKey);
  recipientRecordList = await getRecipientRecordList(_accountKey,recipientAccountList);
  logExitFunction();
  return recipientRecordList;
}
//////////////////// LOAD RECIPIENT DATA //////////////////////

getRecipientRecordList = async(_sponsorKey, _recipientAccountList) => {
  // console.log("==>5 getRecipientRecordList = async(" +_sponsorKey + ","+ _recipientAccountList + ")");
  logFunctionHeader("getRecipientRecordList = async(" +_sponsorKey + ","+ _recipientAccountList + ")");
  let recipientRecordList = [];
  for (let [idx, recipientKey] of Object.entries(_recipientAccountList)) {
    logDetail("JS => Loading Recipient Record " + recipientKey, idx);
    let recipientRecord = await getRecipientRecord(_sponsorKey, recipientKey);
    recipientRecordList.push(recipientRecord);
  }
  logExitFunction();
  return recipientRecordList;
}

getRecipientRecord = async(_sponsorKey, _recipientKey) => {
  // console.log("==>6 getRecipientRecord = async(" + _sponsorKey + ", ", + _recipientKey + ")");
  logFunctionHeader("getRecipientRecord = async(" +_sponsorKey, + ",", + _recipientKey + ")");
  let recipientRecord = new RecipientStruct(_recipientKey);
  recipientRecord.recipientKey = _recipientKey;

  let recordStr = await getSerializedRecipientRecordList(_sponsorKey, _recipientKey);
  recipientRecord.insertionTime = bigIntToDecString(recordStr[0]);
  recipientRecord.stakedSPCoins = bigIntToDecString(recordStr[1]);

  // ToDo New Robin
  recipientRecord.recipientRateList = await getRecipientRateRecordList(_sponsorKey, _recipientKey);
  logExitFunction();
  return recipientRecord;
}

getRecipientRateRecordList = async(_sponsorKey, _recipientKey) => {
// console.log("==>8 getRecipientRateRecordList = async(" + _sponsorKey +","  + _recipientKey + ")");
logFunctionHeader("getRecipientRateRecordList = async(" + _sponsorKey +","  + _recipientKey + ")");
let networkRateList = await getRecipientRateList(_sponsorKey, _recipientKey);
  let recipientRateRecordList = [];

  for (let [idx, recipientRateKey] of Object.entries(networkRateList)) {
    //log("JS => Loading Recipient Rates " + recipientRateKey + " idx = " + idx);
    let recipientRateRecord = await deSerializeRecipientRateRecord(_sponsorKey, _recipientKey, recipientRateKey);

    recipientRateRecordList.push(recipientRateRecord);
  }
  logExitFunction();
  return recipientRateRecordList;
}

getRecipientRateList = async(_sponsorKey, _recipientKey) => {
  logFunctionHeader("getRecipientRateList = async(" + _sponsorKey +","  + _recipientKey + ")");
// console.log("==>9 getRecipientRateList = async(" + _sponsorKey +","  + _recipientKey + ")");

  let networkRateKeys = await spCoinContractDeployed.connect(signer).getRecipientRateList(_sponsorKey, _recipientKey);
  let recipientRateList = [];
  for (let [idx, netWorkRateKey] of Object.entries(networkRateKeys)) {
    recipientRateList.push(netWorkRateKey.toNumber());
  }
  logExitFunction();
  return recipientRateList;
}

//////////////////// LOAD RECIPIENT RATE DATA //////////////////////

getRecipientRateRecord = async(_sponsorKey, _recipientKey, _recipientRateKey) => {
  // console.log("==>12 getRecipientRateRecord = async("+_sponsorKey, + ", " + _recipientKey + ", " + _recipientRateKey + ")");
  logFunctionHeader("getRecipientRateRecord = async("+_sponsorKey, + ", " + _recipientKey + ", " + _recipientRateKey + ")");
  let recipientRateRecord = new RecipientRateStruct();
  recipientRateRecord.recipientRate = _recipientRateKey;
  let agentAccountList = await getAgentAccountList(_sponsorKey, _recipientKey, _recipientRateKey);
  recipientRateRecord.agentAccountList = agentAccountList;
  recipientRateRecord.agentRecordList = await getAgentRecordList(_sponsorKey, _recipientKey, _recipientRateKey, agentAccountList);

  logExitFunction();
  return recipientRateRecord;
}

//////////////////// LOAD RECIPIENT TRANSACTION DATA //////////////////////

getAgentRecordList = async(_sponsorKey, _recipientKey, _recipientRateKey, _agentAccountList) => {
  // console.log("==>14 getAgentRecordList = async("+_sponsorKey, + ", " + _recipientKey + ", " + _recipientRateKey + ")");
  logFunctionHeader("getAgentRecordList = async("+_sponsorKey, + ", " + _recipientKey + ", " + _recipientRateKey + ")");
  let agentRecordList = [];
  for (let [idx, agentKey] of Object.entries(_agentAccountList)) {
    let agentRecord = await getAgentRecord(_sponsorKey, _recipientKey, _recipientRateKey, agentKey);
      agentRecordList.push(agentRecord);
  }
  logExitFunction();
  return agentRecordList;
}

getAgentRecord = async(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey) => {
  // console.log("==>15 getAgentRecord = async(" + ", " + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ")");
  logFunctionHeader("getAgentRecord = async(" + ", " + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ")");
  agentRecord = new AgentStruct();
  agentRecord.agentKey = _agentKey;
  agentRecord.stakedSPCoins = bigIntToDecString(await spCoinContractDeployed.connect(signer).getAgentTotalRecipient(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey));
  agentRecord.agentRateRecordList = await getAgentRateRecordList(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey);
  logExitFunction();
  return agentRecord;
}

//////////////////// LOAD AGENT RATE DATA //////////////////////

getAgentRateRecordList = async(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey) => {
  // console.log("==>16 getAgentRateRecordList = async(" + _recipientKey+ ", " + _agentKey + ")");
  logFunctionHeader("getAgentRateRecordList(" + ", " + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ")");
  
  let agentRateList = await getAgentRateList(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey);

  let agentRateRecordList = [];
  for (let [idx, agentRateKey] of Object.entries(agentRateList)) {
   let agentRateRecord = await deSerializeAgentRateRecord(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey, agentRateKey);
    agentRateRecordList.push(agentRateRecord);
  }
  logExitFunction();
  return agentRateRecordList;
}

getAgentRateList = async (_sponsorKey, _recipientKey, _recipientRateKey, _agentKey) => {
  // console.log("==>17 getAgentRateList = async(" + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ")" );
  logFunctionHeader("getAgentRateList = async(" + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ")" );
  networkRateKeys = await spCoinContractDeployed.connect(signer).getAgentRateList(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey);
  let agentRateList = [];
  for (let [idx, netWorkRateKey] of Object.entries(networkRateKeys)) {
    agentRateList.push(netWorkRateKey.toNumber());
  }
  logExitFunction();
  return agentRateList;
};

//////////////////// LOAD AGENT TRANSACTION DATA //////////////////////

getAgentRateTransactionList = async(_sponsorCoin, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey) => {
  // console.log("==>18 getAgentRateTransactionList = async(" + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ", " + _agentRateKey + ")");
  logFunctionHeader("getAgentRateTransactionList = async(" + _recipientKey + ", " + _recipientRateKey + ", " + _agentKey + ", " + _agentRateKey + ")");
  let agentRateTransactionList = await spCoinContractDeployed.connect(signer).getAgentRateTransactionList(_sponsorCoin, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey);
  logExitFunction();
  return getRateTransactionRecords(agentRateTransactionList);
}

getRecipientRateTransactionList = async(_sponsorCoin, _recipientKey, _recipientRateKey) => {
  // console.log("==>18 getRecipientRateTransactionList = async(" + _recipientKey + ", " + _recipientRateKey + ")");
  logFunctionHeader("getRecipientRateTransactionList = async(" + _recipientKey + ", " + _recipientRateKey + ")");
  let agentRateTransactionList = await spCoinContractDeployed.connect(signer).getRecipientRateTransactionList(_sponsorCoin, _recipientKey, _recipientRateKey);
  logExitFunction();
  return getRateTransactionRecords(agentRateTransactionList);
}

getSerializedAgentRateList = async(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey) => {
  // console.log("==>19 getSerializedAgentRateList = async(", _recipientKey, _recipientRateKey, _agentKey, _agentRateKey, ")");
  logFunctionHeader("getSerializedAgentRateList = async(" + _sponsorKey + ", " + _recipientKey + ", " + _agentKey + ", " + _agentRateKey + ")");
  let agentRateRecordStr = await spCoinContractDeployed.connect(signer).serializeAgentRateRecordStr(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey);
  let agentRateRecordList = agentRateRecordStr.split(",");
  logExitFunction();
  return agentRateRecordList;
}

getRateTransactionRecords = (transactionStr) => {
logFunctionHeader("getRateTransactionRecords = async(" + transactionStr + ")");
// log("getRateTransactionRecords = async(" + transactionStr + ")");
let transactionRecs = [];
  if(transactionStr.length > 0) {
    // console.log("==>19 getRateTransactionRecords = async(" + transactionStr + ")");
    let transactionRows = transactionStr.split("\n");
    for (let row in transactionRows) {
      let transactionFields = transactionRows[row].split(",");
      let transactionRec = new TransactionStruct();
      transactionRec.insertionTime = bigIntToDecString(transactionFields[0]);
      transactionRec.quantity = bigIntToDecString(transactionFields[1]);
      transactionRecs.push(transactionRec);
      // logJSON(transactionRec);
    }
    logExitFunction();
  }
  return transactionRecs;
}

////////////////  RECORD DE-SERIALIZATION FUNCTIONS ///////////////////

getSerializedRecipientRecordList = async(_sponsorKey, _recipientKey) => {
  // console.log("==>7 getSerializedRecipientRecordList = async(" + _sponsorKey + ", " + _recipientKey+ ", " + ")");
  logFunctionHeader("getSerializedRecipientRecordList = async(" + _sponsorKey + ", " + _recipientKey+ ", " + ")");
  let recipientRecordStr = await spCoinContractDeployed.connect(signer).getSerializedRecipientRecordList(_sponsorKey, _recipientKey);
  let recipientRecordList = recipientRecordStr.split(",");
  logExitFunction();
  return recipientRecordList;
}

getSerializedRecipientRateList = async(_sponsorKey, _recipientKey, _recipientRateKey) => {
  // console.log("==>11 getSerializedRecipientRecordList = async(" + _sponsorKey + ", " + _recipientKey + ", "+ _recipientRateKey + ", " + ")");
  logFunctionHeader("getSerializedRecipientRateList = async(" + _sponsorKey + _recipientKey + ", " + _recipientRateKey + ")");
  let recipientRateRecordStr = await spCoinContractDeployed.connect(signer).getSerializedRecipientRateList(_sponsorKey, _recipientKey, _recipientRateKey);
  let recipientRateList = recipientRateRecordStr.split(",");
  logExitFunction();
  return recipientRateList;
}


deSerializeAgentRateRecord = async(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey) => {
  // console.log("==>18 deSerializeAgentRateRecord(" + _sponsorKey   + _recipientKey + ", " + _agentKey+ ", " + _agentRateKey + ")");
  logFunctionHeader("deSerializeAgentRateRecord(" + _sponsorKey   + _recipientKey + ", " + _agentKey+ ", " + _agentRateKey + ")");
  let agentRateRecord = new AgentRateStruct();
  let recordStr = await getSerializedAgentRateList(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey);
  agentRateRecord.agentRate = _agentRateKey;
  agentRateRecord.insertionTime = bigIntToDecString(recordStr[0]);
  agentRateRecord.lastUpdateTime = bigIntToDecString(recordStr[1]);
  agentRateRecord.stakedSPCoins = bigIntToDecString(recordStr[2]);
  
  agentRateRecord.transactions = await getAgentRateTransactionList(_sponsorKey, _recipientKey, _recipientRateKey, _agentKey, _agentRateKey);
  logExitFunction();
  return agentRateRecord;
}

deSerializeRecipientRateRecord = async(_sponsorKey, _recipientKey, _recipientRateKey) => {
// console.log("==>10 deSerializeRecipientRateRecord(" + _sponsorKey + ", " + _recipientKey + ", " + _recipientRateKey + ")");
logFunctionHeader("deSerializeRecipientRateRecord(" + _sponsorKey  + _recipientKey + ", " + _recipientRateKey + ")");
let recipientRateRecord = new RecipientRateStruct();
  let recordStr = await getSerializedRecipientRateList(_sponsorKey, _recipientKey, _recipientRateKey);
  recipientRateRecord.recipientRate = _recipientRateKey;
  recipientRateRecord.insertionTime = bigIntToDecString(recordStr[0]);
  recipientRateRecord.lastUpdateTime = bigIntToDecString(recordStr[1]);
  recipientRateRecord.stakedSPCoins = bigIntToDecString(recordStr[2]);
  recipientRateRecord.transactions = await getRecipientRateTransactionList(_sponsorKey, _recipientKey, _recipientRateKey);
  recipientRateRecord.recipientRecordList = await getRecipientRateRecord(_sponsorKey, _recipientKey, _recipientRateKey);
  
  logExitFunction();
  return recipientRateRecord;
}

/////////////////////// EXPORT MODULE FUNCTIONS ///////////////////////

module.exports = {
  deSerializeAgentRateRecord,
  deSerializeRecipientRateRecord,
  getAccountList,
  getAccountListSize,
  getAccountRecipientKeys,
  getAccountRecord,
  getAccountRecords,

  getAgentRateList,
  getAgentRateRecordList,
  getAgentRateTransactionList,
  getAgentAccountList,
  getAgentRecord,
  getAgentRecordList,

  getRecipientKeySize,
  getRecipientRateList,
  getRecipientRateRecord,
  getRecipientRateRecordList,
  getRecipientRateTransactionList,
  getRecipientRecord,
  getRecipientRecordList,
  getRecipientsByAccount,

  getSerializedAccountRecord,
  getSerializedAgentRateList,
  
  getSerializedRecipientRateList,
  getSerializedRecipientRecordList,

  injectReadMethodsContract,
};
