const crypto = require("node:crypto");

class RedisIdempotencyStore {
  constructor(redisClient, { ttlSeconds = 24 * 60 * 60, processingSeconds = 60 } = {}) {
    this.redisClient = redisClient;
    this.ttlSeconds = ttlSeconds;
    this.processingSeconds = processingSeconds;
  }

  async execute(key, fingerprint, operation) {
    const recordKey = this.recordKey(key);
    const processingRecord = JSON.stringify({ fingerprint, status: "processing" });
    const claimed = await this.redisClient.set(recordKey, processingRecord, {
      NX: true,
      EX: this.processingSeconds,
    });

    if (!claimed) {
      return this.waitForResult(recordKey, fingerprint, operation);
    }

    try {
      const result = await operation();
      await this.redisClient.set(
        recordKey,
        JSON.stringify({ fingerprint, status: "completed", result }),
        { EX: this.ttlSeconds },
      );
      return result;
    } catch (error) {
      await this.redisClient.del(recordKey);
      throw error;
    }
  }

  async waitForResult(recordKey, fingerprint, operation) {
    const deadline = Date.now() + this.processingSeconds * 1000;
    let pollInterval = 50; // start at 50 ms, back off exponentially up to 2 s

    while (Date.now() < deadline) {
      const record = await this.readRecord(recordKey);

      if (!record) {
        return this.executeClaimed(recordKey, fingerprint, operation);
      }

      this.assertFingerprint(record, fingerprint);
      if (record.status === "completed") {
        return record.result;
      }

      await delay(pollInterval);
      pollInterval = Math.min(pollInterval * 2, 2000);
    }

    const error = new Error("Idempotent request is still processing");
    error.code = "IDEMPOTENCY_IN_PROGRESS";
    throw error;
  }

  async executeClaimed(recordKey, fingerprint, operation) {
    const claimed = await this.redisClient.set(
      recordKey,
      JSON.stringify({ fingerprint, status: "processing" }),
      { NX: true, EX: this.processingSeconds },
    );

    if (!claimed) {
      return this.waitForResult(recordKey, fingerprint, operation);
    }

    try {
      const result = await operation();
      await this.redisClient.set(
        recordKey,
        JSON.stringify({ fingerprint, status: "completed", result }),
        { EX: this.ttlSeconds },
      );
      return result;
    } catch (error) {
      await this.redisClient.del(recordKey);
      throw error;
    }
  }

  async readRecord(recordKey) {
    const rawRecord = await this.redisClient.get(recordKey);
    return rawRecord ? JSON.parse(rawRecord) : null;
  }

  assertFingerprint(record, fingerprint) {
    if (record.fingerprint !== fingerprint) {
      const error = new Error("Idempotency-Key was already used with a different request");
      error.code = "IDEMPOTENCY_CONFLICT";
      throw error;
    }
  }

  recordKey(key) {
    const digest = crypto.createHash("sha256").update(key).digest("hex");
    return `idempotency:${digest}`;
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

module.exports = { RedisIdempotencyStore };
