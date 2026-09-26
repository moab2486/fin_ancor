const express = require("express");
const crypto = require("node:crypto");

function createUserRouter(authService, idempotencyService, authenticate, authRateLimiter) {
  const router = express.Router();

  // Rate limiter only applies to the three auth mutation endpoints, not GET /me
  router.post("/register", authRateLimiter, idempotent(idempotencyService, (request) => authService.register(request.body || {}), 201));

  router.post("/login", authRateLimiter, idempotent(idempotencyService, (request) => authService.login(request.body || {}), 200));

  router.post("/verify-otp", authRateLimiter, idempotent(idempotencyService, (request) => authService.verifyOtp(request.body || {}), 200));

  router.get("/me", authenticate, (request, response) => {
    response.json({ user: request.auth });
  });

  return router;
}

function idempotent(idempotencyService, operation, successStatus) {
  return async (request, response) => {
    const key = request.get("Idempotency-Key");
    const fingerprint = crypto
      .createHash("sha256")
      .update(`${request.method}:${request.originalUrl}:${JSON.stringify(request.body || {})}`)
      .digest("hex");

    try {
      const result = await idempotencyService.execute({
        key,
        fingerprint,
        operation: () => operation(request),
      });
      response.status(successStatus).json(result);
    } catch (error) {
      sendError(response, error);
    }
  };
}

function sendError(response, error) {
  if (error.code === "VALIDATION_ERROR") {
    return response.status(400).json({ error: error.message, details: error.details });
  }

  if (error.code === "EMAIL_TAKEN") {
    return response.status(409).json({ error: error.message });
  }

  if (error.code === "INVALID_LOGIN") {
    return response.status(401).json({ error: error.message });
  }

  if (error.code === "INVALID_OTP") {
    return response.status(401).json({ error: error.message });
  }

  if (error.code === "PHONE_REQUIRED") {
    return response.status(400).json({ error: error.message });
  }

  if (error.code === "PHONE_TAKEN") {
    return response.status(409).json({ error: error.message });
  }

  if (error.code === "OTP_DELIVERY_UNAVAILABLE") {
    return response.status(503).json({ error: error.message });
  }

  if (error.code === "INVALID_IDEMPOTENCY_KEY") {
    return response.status(400).json({ error: error.message });
  }

  if (error.code === "IDEMPOTENCY_CONFLICT") {
    return response.status(409).json({ error: error.message });
  }

  // A prior identical request is still being processed — tell the client to retry
  if (error.code === "IDEMPOTENCY_IN_PROGRESS") {
    return response.status(503).json({ error: "Request is still processing, please retry shortly" });
  }

  console.error(error);
  return response.status(500).json({ error: "Internal server error" });
}

module.exports = { createUserRouter };
