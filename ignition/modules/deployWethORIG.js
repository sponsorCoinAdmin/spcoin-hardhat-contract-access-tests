const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WETH", (m) => {
  const token = m.contract("WETH9", []);

//   m.call(weth, "launch", []);

  return { token };
});