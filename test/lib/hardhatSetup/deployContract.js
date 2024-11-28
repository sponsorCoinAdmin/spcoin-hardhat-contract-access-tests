let spCoinContractDeployed;

deploySpCoinContract = async () => {
  spCoinContractDeployed = await deployContract("SPCoin");
  return spCoinContractDeployed;
}

deployWETH9Contract = async () => {
  weth9ContractDeployed = await deployContract("WETH9");
  return weth9ContractDeployed;
}

deployContract = async (symbol) => {
  //setLogMode(LOG_MODE.LOG_SETUP, true);
  // console.log("AAAA spCoinContractDeployed = await spCoinContract.deploy() AAAAAAAAAAAAAAAAAAAAAA");

  let contract = await hre.ethers.getContractFactory(symbol);
  contractDeployed = await contract.deploy();
  await contractDeployed.deployed();
//  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
  return contractDeployed;
}

module.exports = {
  deployContract,
  deploySpCoinContract,
  deployWETH9Contract,
  spCoinContractDeployed
}


