const SEND_TIMEOUT_MS = 10_000;

class WahaOtpDelivery {
  constructor({ baseUrl, apiKey, session = "default" }) {
    if (!baseUrl) {
      throw new Error("WahaOtpDelivery: baseUrl is required (set WAHA_URL environment variable)");
    }
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
    this.session = session;
  }

  async send(phone, code) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}/api/sendText`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Api-Key": this.apiKey },
        body: JSON.stringify({ session: this.session, chatId: `${phone}@c.us`, text: `Your verification code is ${code}` }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`WAHA OTP delivery failed: ${response.status}`);
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(`WAHA OTP delivery timed out after ${SEND_TIMEOUT_MS}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

module.exports = { WahaOtpDelivery };
