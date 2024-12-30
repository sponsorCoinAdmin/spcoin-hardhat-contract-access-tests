const stringifyBigInt = (obj) => {
  return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v,2)
}

module.exports = {
    stringifyBigInt
}