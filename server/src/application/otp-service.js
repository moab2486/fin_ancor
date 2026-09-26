const crypto = require("node:crypto");

class OtpService {
  constructor({ store, delivery, hmacSecret }) {
    this.store = store;
    this.delivery = delivery;
    // HMAC secret used for hashing OTP codes — prevents rainbow-table attacks if Redis is compromised
    this.hmacSecret = hmacSecret;
  }

  async issue({ userId, phone }) {
    const challengeId = crypto.randomUUID();
    const code = String(crypto.randomInt(100000, 1000000));
    // Use the store's configured TTL so expiresInSeconds is always accurate
    const expiresInSeconds = this.store.ttlSeconds;
    await this.store.save(challengeId, { userId, codeHash: this.#hashCode(code), attempts: 0 });
    try {
      await this.delivery.send(phone, code);
    } catch (error) {
      await this.store.remove(challengeId);
      const deliveryError = new Error("OTP delivery service is unavailable");
      deliveryError.code = "OTP_DELIVERY_UNAVAILABLE";
      deliveryError.cause = error;
      throw deliveryError;
    }
    return { otpRequired: true, challengeId, expiresInSeconds };
  }

  async verify(challengeId, code) {
    if (typeof challengeId !== "string" || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      const error = new Error("Invalid OTP");
      error.code = "INVALID_OTP";
      throw error;
    }
    const userId = await this.store.consume(challengeId, code, (c) => this.#hashCode(c));
    if (!userId) {
      const error = new Error("Invalid or expired OTP");
      error.code = "INVALID_OTP";
      throw error;
    }
    return userId;
  }

  /** HMAC-SHA256 with the server secret — cannot be reversed without the key */
  #hashCode(code) {
    return crypto.createHmac("sha256", this.hmacSecret).update(code).digest("hex");
  }
}

module.exports = { OtpService };
