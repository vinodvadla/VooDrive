const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

module.exports = {
  hashPassword: async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  },

  comparePassword: async (plainText, hashedPassword) => {
    return await bcrypt.compare(plainText, hashedPassword);
  },
};
    