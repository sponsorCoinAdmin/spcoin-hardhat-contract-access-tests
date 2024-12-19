const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("USDC", (m) => {
  const token = m.contract("USDC", []);

//   m.call(weth, "launch", []);

  return { token };
});