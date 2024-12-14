const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SPCOIN", (m) => {
  const weth = m.contract("SPCoin", []);

//   m.call(weth, "launch", []);

  return { weth };
});