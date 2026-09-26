const { createClient } = require("redis");

function createRedisClient(url) {
  return createClient({ url });
}

module.exports = { createRedisClient };
