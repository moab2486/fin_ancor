class IdempotencyService {
  constructor(store) {
    this.store = store;
  }

  execute({ key, fingerprint, operation }) {
    const trimmedKey = typeof key === "string" ? key.trim() : "";
    if (trimmedKey.length < 8 || trimmedKey.length > 255) {
      const error = new Error("Idempotency-Key must be between 8 and 255 characters");
      error.code = "INVALID_IDEMPOTENCY_KEY";
      throw error;
    }

    return this.store.execute(trimmedKey, fingerprint, operation);
  }
}

module.exports = { IdempotencyService };
