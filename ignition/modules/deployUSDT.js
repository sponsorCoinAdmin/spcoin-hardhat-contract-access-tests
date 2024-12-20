const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("USDT", (m) => {
  const token = m.contract("USDT", [123456789n]);

//   m.call(weth, "launch", []);

  return { token };
});