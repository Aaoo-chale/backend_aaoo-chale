const bcrypt = require("bcrypt");
exports.hashPassword = async function (pwd) {
  return await bcrypt.hash(pwd, +process.env.SALT_ROUNDS);
};

exports.unHashPassword = async function (pwd, hashPwd) {
  console.log(pwd, hashPwd);
  return await bcrypt.compare(pwd, hashPwd);
};
