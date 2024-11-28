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

/*
// import hre from "hardhat";
// import fs from 'fs';

let spCoinContractDeployed;
let ethers = hre.ethers;

const deployContract = async (symbol) => {
  //setLogMode(LOG_MODE.LOG_SETUP, true);

  let contract = await hre.ethers.getContractFactory(symbol);
  const contractDeployed = await contract.deploy();
  await contractDeployed.deployed();
  return contractDeployed;
}

const deploySpCoinContract = async () => {
  spCoinContractDeployed = await deployContract("SPCoin");
  return spCoinContractDeployed;
}

const deployWETH9Contract = async () => {
  let weth9ContractDeployed = await deployContract("WETH9");
  return weth9ContractDeployed;
}

// load ABI from build artifacts
async function getDeployedArtifactsAbiAddress(symbol){
  console.log(`EXECUTING: getDeployedArtifactsAbiAddress(${symbol})`)
  let contractDeployed = await deployContract(symbol);
  const address = contractDeployed.address;
  // console.log(`contractDeployed.address = ${contractDeployed.address}`)
  // console.log(`contractDeployed = ${JSON.stringify(contractDeployed, null, 2)}`)
  const fsPromises = fs.promises;
  const HARDHAT_ARTIFACTS_HOME = "artifacts/contracts/";
  const ABI_FILE_PATH=`${HARDHAT_ARTIFACTS_HOME}${symbol}.sol/${symbol}.json`
  console.log(`ABI_FILE_PATH = ${ABI_FILE_PATH}`);
  const data = await fsPromises.readFile(ABI_FILE_PATH, 'utf8');
  const abi = JSON.parse(data)['abi'];
  return { address, abi };
}

async function getWeth9Contract(signer) {
  const signedWeth = getNewContract(signer, "WETH9");
  return signedWeth;
}

async function getSpCoinContract(signer) {
  const signedWeth = getNewContract(signer, "SPCoin");
  return signedWeth;
}

async function getNewContract(signer, symbol) {
  await deployContract(symbol);
  const signedWeth = getDeployedContract(signer, symbol);
  return signedWeth;
}

async function getDeployedContract(signer, symbol) {
  const { address, abi } = await getDeployedArtifactsAbiAddress(symbol);
  const signedWeth = new ethers.Contract(address, abi, signer);
  return signedWeth;
}

module.exports = {
  deployContract,
          deploySpCoinContract,
          deployWETH9Contract,
          getDeployedArtifactsAbiAddress,
          getDeployedContract,
          getNewContract,
          getSpCoinContract,
          getWeth9Contract
  }
          */
