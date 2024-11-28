import hre from "hardhat";
import fs from 'fs';
let ethers = hre.ethers;

let spCoinContractDeployed;

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
  const signedWeth = getNewDeployedContract(signer, "WETH9");
  return signedWeth;
}

async function getSpCoinContract(signer) {
  const signedWeth = getNewDeployedContract(signer, "SPCoin");
  return signedWeth;
}

async function getNewDeployedContract(signer, symbol) {
  await deployContract(symbol);
  const signedWeth = getDeployedContract(signer, symbol);
  return signedWeth;
}

async function getDeployedContract(signer, symbol) {
  const { address, abi } = await getDeployedArtifactsAbiAddress(symbol);
  const signedWeth = new ethers.Contract(address, abi, signer);
  return signedWeth;
}

export {  deployContract,
          deploySpCoinContract,
          deployWETH9Contract,
          getDeployedArtifactsAbiAddress,
          getDeployedContract,
          getNewDeployedContract,
          getSpCoinContract,
          getWeth9Contract
  }