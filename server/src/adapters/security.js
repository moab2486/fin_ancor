const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passwordHasher = {
  hash(password) {
    return bcrypt.hash(password, 12);
  },
  compare(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  },
};

function createTokenService(secret) {
  return {
    sign(payload) {
      return jwt.sign(payload, secret, { expiresIn: "1h" });
    },
    verify(token) {
      return jwt.verify(token, secret);
    },
  };
}

module.exports = { passwordHasher, createTokenService };
