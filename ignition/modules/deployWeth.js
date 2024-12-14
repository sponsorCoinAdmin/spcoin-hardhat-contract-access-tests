const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WETH", (m) => {
  const weth = m.contract("WETH9", []);

//   m.call(weth, "launch", []);

  return { weth };
});