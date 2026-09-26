const { rateLimit } = require("express-rate-limit");

function createAuthRateLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many authentication attempts, try again later" },
  });
}

module.exports = { createAuthRateLimiter };
