const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("USDT", (m) => {
  const token = m.contract("USDT", []);

//   m.call(weth, "launch", []);

  return { token };
});