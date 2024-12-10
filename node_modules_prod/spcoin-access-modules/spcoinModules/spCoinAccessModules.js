const { SpCoinLogger, LOG_MODE } = require("./utils/logging");
const { SpCoinERC20Module } = require("./modules/spCoinERC20Module");
const { SpCoinDeleteModule } = require("./modules/spCoinDeleteModule");
const { SpCoinAddModule } = require("./modules/spCoinAddModule");
const { SpCoinReadModule } = require("./modules/spCoinReadModule");
const { SpCoinRewardsModule } = require("./modules/spCoinRewardsModule"); 
const { SpCoinStakingModule } = require("./modules/spCoinStakingModule"); 
const { second, minute, hour, day, week, year, month , millennium } = require("./modules/spCoinStakingModule");
const ethers = require('ethers');

class SpCoinAccessModules {
  // constructor(_spCoinContractDeployed) {
    constructor(spCoinABI, spCoinAddress, signer) {
    // console.log(`AAA spCoinAddress = ${spCoinAddress}`)
    // console.log(`AAA spCoinABI = ${JSON.stringify(spCoinABI,null,2)}`)
    // console.log(`AAA signer = ${JSON.stringify(signer,null,2)}`)

    // console.log(`AAA ethers = ${JSON.stringify(ethers,null,2)}`)
    const signedContract = new ethers.Contract(spCoinAddress, spCoinABI, signer);

    // console.log(`spCoinAddress = ${spCoinAddress}`)
    // console.log(`spCoinABI = ${JSON.stringify(spCoinABI,null,2)}`)
    // console.log(`signer = ${JSON.stringify(signer,null,2)}`)
    this.spCoinContractDeployed = signedContract;
    this.spCoinAddMethods = new SpCoinAddModule(this.spCoinContractDeployed, signedContract);
    this.spCoinDeleteMethods = new SpCoinDeleteModule(this.spCoinContractDeployed);
    this.spCoinERC20Methods = new SpCoinERC20Module(this.spCoinContractDeployed);
    this.spCoinLogger = new SpCoinLogger(this.spCoinContractDeployed);
    this.spCoinReadMethods = new SpCoinReadModule(this.spCoinContractDeployed);
    this.spCoinRewardsMethods = new SpCoinRewardsModule(this.spCoinContractDeployed);
    this.spCoinStakingMethods = new SpCoinStakingModule(this.spCoinContractDeployed);
  }

  methods = () => {
    return {
      spCoinContractDeployed : this.spCoinContractDeployed,
      spCoinAddMethods       : this.spCoinAddMethods,
      spCoinDeleteMethods    : this.spCoinDeleteMethods,
      spCoinERC20Methods     : this.spCoinERC20Methods,
      spCoinLogger           : this.spCoinLogger,
      spCoinReadMethods      : this.spCoinReadMethods,
      spCoinRewardsMethods   : this.spCoinRewardsMethods,
      spCoinStakingMethods   : this.spCoinStakingMethods
    }
  }
}

module.exports =  {
  SpCoinAccessModules,
  SpCoinAddModule,
  SpCoinDeleteModule,
  SpCoinERC20Module,
  SpCoinLogger,
  SpCoinReadModule,
  SpCoinRewardsModule,
  SpCoinStakingModule
}
