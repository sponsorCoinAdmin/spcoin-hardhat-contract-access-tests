const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CHKN", (m) => {
  const token = m.contract("Chickencoin", [1234567890000101099n]);

//   m.call(weth, "launch", []);

  return { token };
});