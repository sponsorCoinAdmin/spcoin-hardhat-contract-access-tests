async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying SPCoin contract with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const SPCoin = await ethers.getContractFactory("SPCoin");
    const spCoin = await SPCoin.deploy();
    // await spCoin.init();

    console.log("SPCoin address:", spCoin.address);
    console.log("SPCoin name:", await spCoin.name());

    const network = "https://sepolia.etherscan.io/address/";
    console.log("Contract Address:", network+spCoin.address);
    console.log("Deployer Address:", network+deployer.address);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
