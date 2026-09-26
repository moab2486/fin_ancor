const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { UserService } = require("./src/application/user-service");
const { AuthService } = require("./src/application/auth-service");
const { PrismaUserRepository } = require("./src/adapters/prisma-user-repository");
const { passwordHasher, createTokenService } = require("./src/adapters/security");
const { createUserRouter } = require("./src/http/user-routes");
const { createAdminRouter } = require("./src/http/admin-routes");
const { createAuthMiddleware } = require("./src/http/auth-middleware");
const { createAuthRateLimiter } = require("./src/http/rate-limit");
const { IdempotencyService } = require("./src/application/idempotency-service");
const { RedisIdempotencyStore } = require("./src/adapters/redis-idempotency-store");
const { createPrismaClient } = require("./src/infrastructure/prisma");
const { createRedisClient } = require("./src/infrastructure/redis");
const { RedisOtpStore } = require("./src/adapters/redis-otp-store");
const { WahaOtpDelivery } = require("./src/adapters/waha-otp-delivery");
const { OtpService } = require("./src/application/otp-service");
const { openapiDocument } = require("./src/http/openapi");

// Fail fast if required environment variables are missing
const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET", "WAHA_URL", "WAHA_API_KEY", "OTP_HMAC_SECRET"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

// Catch unhandled promise rejections to prevent silent crashes
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

const app = express();
app.set("trust proxy", 1);
const port = Number(process.env.PORT || 3000);
const prisma = createPrismaClient(process.env.DATABASE_URL);
const redis = createRedisClient(process.env.REDIS_URL);
const tokenService = createTokenService(process.env.JWT_SECRET);
const otpService = new OtpService({
	store: new RedisOtpStore(redis),
	delivery: new WahaOtpDelivery({
		baseUrl: process.env.WAHA_URL,
		apiKey: process.env.WAHA_API_KEY,
		session: process.env.WAHA_SESSION || "default",
	}),
	hmacSecret: process.env.OTP_HMAC_SECRET,
});
const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService({
	userRepository,
	passwordHasher,
	tokenService,
	otpService,
});
const userService = new UserService({
	userRepository,
});
const { authenticate, requireRole } = createAuthMiddleware(authService);
app.use(express.json());
app.get("/openapi.json", (_request, response) => response.json(openapiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument, {
	customSiteTitle: "Fin Anchor API Docs",
}));

app.get("/health", (_request, response) => {
	response.json({ status: "ok" });
});

async function start() {
	await redis.connect();
	const idempotencyService = new IdempotencyService(new RedisIdempotencyStore(redis));
	app.use("/users", createUserRouter(authService, idempotencyService, authenticate, createAuthRateLimiter()));
	app.use("/admin", createAdminRouter(userService, authenticate, requireRole));

	const server = app.listen(port, "0.0.0.0", () => {
		console.log(`Server listening on port ${port}`);
	});

	async function shutdown() {
		server.close();
		await Promise.all([prisma.$disconnect(), redis.quit()]);
	}

	process.on("SIGTERM", shutdown);
	process.on("SIGINT", shutdown);
}

start().catch((error) => {
	console.error("Failed to start server", error);
	process.exitCode = 1;
});
