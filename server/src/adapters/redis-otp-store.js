// Atomic Lua script for consuming an OTP record.
// Returns:
//   "NOT_FOUND"     — key does not exist (expired or already consumed)
//   "MAX_ATTEMPTS"  — attempt limit reached; key deleted
//   "INVALID"       — wrong code; attempt counter incremented
//   userId string   — correct code; key deleted
const CONSUME_SCRIPT = `
local key = KEYS[1]
local codeHash = ARGV[1]
local maxAttempts = tonumber(ARGV[2])

local raw = redis.call('GET', key)
if not raw then return 'NOT_FOUND' end

local record = cjson.decode(raw)

if record.attempts >= maxAttempts then
  redis.call('DEL', key)
  return 'MAX_ATTEMPTS'
end

if record.codeHash ~= codeHash then
  record.attempts = record.attempts + 1
  redis.call('SET', key, cjson.encode(record), 'KEEPTTL')
  return 'INVALID'
end

redis.call('DEL', key)
return tostring(record.userId)
`;

class RedisOtpStore {
  constructor(redisClient, { ttlSeconds = 5 * 60, maxAttempts = 5 } = {}) {
    this.redisClient = redisClient;
    this.ttlSeconds = ttlSeconds;
    this.maxAttempts = maxAttempts;
  }

  async save(challengeId, value) {
    await this.redisClient.set(`otp:${challengeId}`, JSON.stringify(value), { EX: this.ttlSeconds });
  }

  async consume(challengeId, code, hashCode) {
    const key = `otp:${challengeId}`;
    const result = await this.redisClient.eval(
      CONSUME_SCRIPT,
      { keys: [key], arguments: [hashCode(code), String(this.maxAttempts)] },
    );

    if (result === "NOT_FOUND" || result === "MAX_ATTEMPTS" || result === "INVALID") {
      return null;
    }

    // result is the userId as a string; parse back to the original type
    const parsed = Number(result);
    return Number.isNaN(parsed) ? result : parsed;
  }

  remove(challengeId) {
    return this.redisClient.del(`otp:${challengeId}`);
  }
}

module.exports = { RedisOtpStore };
