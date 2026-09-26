const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Fin Anchor Server API",
    version: "1.0.0",
    description: "Authentication, OTP verification, and role-based administration API.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "System", description: "Service health" },
    { name: "Authentication", description: "Registration, login, and OTP verification" },
    { name: "Administration", description: "Administrator-only operations" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    parameters: {
      IdempotencyKey: {
        name: "Idempotency-Key",
        in: "header",
        required: true,
        description: "Unique key for safely retrying the request. Reusing it with a different payload returns 409.",
        schema: { type: "string", minLength: 8, maxLength: 255 },
      },
    },
    schemas: {
      User: {
        type: "object",
        required: ["id", "email", "role"],
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", format: "email", example: "user@example.com" },
          phone: { type: "string", example: "15551234567" },
          name: { type: "string", nullable: true, example: "Jane Doe" },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
        },
      },
      TokenClaims: {
        type: "object",
        required: ["sub", "email", "role", "iat", "exp"],
        properties: {
          sub: { type: "string", description: "User ID as a string", example: "1" },
          email: { type: "string", format: "email", example: "user@example.com" },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
          iat: { type: "integer", description: "Issued-at timestamp (Unix seconds)" },
          exp: { type: "integer", description: "Expiry timestamp (Unix seconds)" },
        },
      },
      Credentials: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 8 },
        },
      },
      RegisterRequest: {
        allOf: [
          { $ref: "#/components/schemas/Credentials" },
          {
            type: "object",
            required: ["phone"],
            properties: {
              phone: { type: "string", description: "Phone number used for WhatsApp OTP delivery", example: "15551234567" },
              name: { type: "string", example: "Jane Doe" },
            },
          },
        ],
      },
      OtpChallenge: {
        type: "object",
        required: ["otpRequired", "challengeId", "expiresInSeconds"],
        properties: {
          otpRequired: { type: "boolean", example: true },
          challengeId: { type: "string", format: "uuid" },
          expiresInSeconds: { type: "integer", example: 300 },
        },
      },
      VerifyOtpRequest: {
        type: "object",
        required: ["challengeId", "code"],
        properties: {
          challengeId: { type: "string", format: "uuid" },
          code: { type: "string", pattern: "^[0-9]{6}$", example: "123456" },
        },
      },
      AuthResult: {
        type: "object",
        required: ["token", "user"],
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: { error: { type: "string" }, details: { type: "object", additionalProperties: true } },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Check service health",
        responses: { 200: { description: "Service is healthy", content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } } } } },
      },
    },
    "/users/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a user and send an OTP",
        parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } } },
        responses: responses({ 201: { description: "OTP challenge created", schema: { $ref: "#/components/schemas/OtpChallenge" } }, 409: "Email or phone already registered", 503: "OTP delivery unavailable" }),
      },
    },
    "/users/login": {
      post: {
        tags: ["Authentication"],
        summary: "Validate credentials and send an OTP",
        parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Credentials" } } } },
        responses: responses({ 200: { description: "OTP challenge created", schema: { $ref: "#/components/schemas/OtpChallenge" } }, 401: "Invalid credentials", 503: "OTP delivery unavailable" }),
      },
    },
    "/users/verify-otp": {
      post: {
        tags: ["Authentication"],
        summary: "Verify OTP and issue a JWT",
        parameters: [{ $ref: "#/components/parameters/IdempotencyKey" }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/VerifyOtpRequest" } } } },
        responses: responses({ 200: { description: "Authenticated user", schema: { $ref: "#/components/schemas/AuthResult" } }, 401: "Invalid or expired OTP" }),
      },
    },
    "/users/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get the authenticated token claims",
        security: [{ bearerAuth: [] }],
        responses: responses({ 200: { description: "Authenticated token claims", schema: { type: "object", properties: { user: { $ref: "#/components/schemas/TokenClaims" } } } }, 401: "Missing or invalid bearer token" }),
      },
    },
    "/admin/users": {
      get: {
        tags: ["Administration"],
        summary: "List users",
        security: [{ bearerAuth: [] }],
        responses: responses({ 200: { description: "User list", schema: { type: "object", properties: { users: { type: "array", items: { $ref: "#/components/schemas/User" } } } } }, 401: "Missing or invalid bearer token", 403: "ADMIN role required" }),
      },
    },
  },
};

function responses(success) {
  const result = {};
  for (const [status, value] of Object.entries(success)) {
    result[status] = typeof value === "string" ? { description: value } : { description: value.description, content: { "application/json": { schema: value.schema } } };
  }
  for (const status of [400, 401, 409, 429, 500, 503]) {
    if (!result[status]) result[status] = { description: "Request failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } };
  }
  return result;
}

module.exports = { openapiDocument };
