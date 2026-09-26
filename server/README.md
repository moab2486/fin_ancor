# Fin Anchor Server

Express API for user authentication, WhatsApp OTP verification, role-based access control, and administration.

## Features

- Hexagonal architecture for authentication and persistence
- User registration and password login
- WhatsApp OTP challenge and verification through WAHA
- JWT access tokens
- `USER` and `ADMIN` roles
- Redis-backed idempotency for auth requests
- Redis-backed OTP challenges
- Authentication rate limiting
- PostgreSQL persistence with Prisma
- Nginx reverse proxy
- Interactive Swagger documentation

## Services

The Docker Compose stack contains:

| Service | Purpose | Access |
| --- | --- | --- |
| `server` | Express API | Internal port `3000` |
| `db` | PostgreSQL database | Host port `5432` |
| `redis` | OTP and idempotency storage | Internal port `6379` |
| `waha` | WhatsApp HTTP API and OTP delivery | `http://localhost:8082` |
| `nginx` | Public reverse proxy | `http://localhost:8080` |

Only Nginx is used as the public HTTP entrypoint for the API and WAHA.

## Requirements

- Docker Engine
- Docker Compose
- Node.js 24 or newer for local Prisma commands
- A WhatsApp account to pair with WAHA

## Configuration

The startup script creates missing secrets in `.env` and preserves them across restarts:

- `WAHA_API_KEY`
- `WAHA_DASHBOARD_USERNAME`
- `WAHA_DASHBOARD_PASSWORD`
- `WHATSAPP_SWAGGER_USERNAME`
- `WHATSAPP_SWAGGER_PASSWORD`
- `JWT_SECRET`
- `WAHA_SESSION`

Do not commit `.env`. Use placeholders when creating a deployment-specific environment file:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fin_anchor?schema=public"
REDIS_URL="redis://localhost:6379"
WAHA_SESSION="default"
WAHA_API_KEY="replace-me"
WAHA_DASHBOARD_USERNAME="replace-me"
WAHA_DASHBOARD_PASSWORD="replace-me"
WHATSAPP_SWAGGER_USERNAME="replace-me"
WHATSAPP_SWAGGER_PASSWORD="replace-me"
JWT_SECRET="replace-me"
```

## Start The Stack

Generate credentials, build the server, start all services, and wait for health checks:

```bash
npm run docker:up -- -d --wait
```

The public API is available at:

```text
http://localhost:8080
```

Stop the stack:

```bash
npm run docker:down
```

PostgreSQL and Redis data are stored in named Docker volumes. WAHA sessions and media are also persisted in named volumes.

## WAHA Pairing

OTP delivery requires the WAHA session to be connected to WhatsApp.

1. Start the stack.
2. Open `http://localhost:8082/`.
3. Authenticate with `WAHA_DASHBOARD_USERNAME` and `WAHA_DASHBOARD_PASSWORD` from `.env`.
4. Start or inspect the session named by `WAHA_SESSION`.
5. Scan the WhatsApp QR code.
6. Wait until the session status is `WORKING`.

If the session is stopped or not paired, registration and login return `503` because an OTP cannot be delivered.

## API Documentation

Swagger UI:

```text
http://localhost:8080/docs/
```

OpenAPI JSON:

```text
http://localhost:8080/openapi.json
```

## Authentication Flow

Registration and login do not immediately return a JWT. They return an OTP challenge.

### 1. Register

```bash
curl -X POST http://localhost:8080/users/register \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: register-example-001' \
  -d '{
    "email": "user@example.com",
    "phone": "15551234567",
    "name": "Example User",
    "password": "correct-horse-battery"
  }'
```

Example response:

```json
{
  "otpRequired": true,
  "challengeId": "challenge-uuid",
  "expiresInSeconds": 300
}
```

### 2. Login

```bash
curl -X POST http://localhost:8080/users/login \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: login-example-001' \
  -d '{
    "email": "user@example.com",
    "password": "correct-horse-battery"
  }'
```

### 3. Verify OTP

```bash
curl -X POST http://localhost:8080/users/verify-otp \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: otp-example-001' \
  -d '{
    "challengeId": "challenge-uuid",
    "code": "123456"
  }'
```

Successful verification returns a JWT:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone": "15551234567",
    "name": "Example User",
    "role": "USER"
  }
}
```

### 4. Use The JWT

```bash
curl http://localhost:8080/users/me \
  -H 'Authorization: Bearer jwt-token'
```

## RBAC

New accounts receive the `USER` role. Registration cannot assign `ADMIN`.

Admin-only endpoint:

```bash
curl http://localhost:8080/admin/users \
  -H 'Authorization: Bearer admin-jwt-token'
```

To promote an account locally:

```bash
docker compose exec db psql -U postgres -d fin_anchor \
  -c 'UPDATE "User" SET role = '\''ADMIN'\'' WHERE email = '\''admin@example.com'\'';'
```

The user must log in again after promotion so the new role is included in the JWT.

## Idempotency

`POST /users/register`, `POST /users/login`, and `POST /users/verify-otp` require an `Idempotency-Key` header.

- Keys must be 8 to 255 characters.
- Repeating the same key and payload replays the stored result.
- Reusing a key with a different payload returns `409`.
- Results are stored in Redis for 24 hours.
- Failed operations release the key so they can be retried.

## Rate Limiting

Authentication routes are limited to 10 requests per 15-minute window per client IP. Express is configured to trust the single Nginx proxy, so the limiter uses the forwarded client address.

## Architecture

```text
src/
  domain/
    user.js                         Validation and domain rules
  application/
    auth-service.js                 Registration, login, OTP, JWT orchestration
    otp-service.js                  OTP challenge lifecycle
    user-service.js                 User administration use cases
    idempotency-service.js          Idempotency port coordination
  adapters/
    prisma-user-repository.js      PostgreSQL/Prisma adapter
    redis-otp-store.js              Redis OTP adapter
    redis-idempotency-store.js      Redis idempotency adapter
    waha-otp-delivery.js             WAHA WhatsApp delivery adapter
    security.js                     bcrypt and JWT adapters
  http/
    user-routes.js                  Auth HTTP endpoints
    auth-middleware.js               Bearer authentication and RBAC
    admin-routes.js                 Admin HTTP endpoints
    rate-limit.js                   Authentication rate limiting
    openapi.js                      OpenAPI document
  infrastructure/
    prisma.js                       Prisma client factory
    redis.js                        Redis client factory
```

The application layer depends on ports and use-case contracts. Infrastructure details such as Prisma, Redis, WAHA, bcrypt, and JWT are injected from `app.js`.

## Database Migrations

Validate the Prisma schema:

```bash
npm run prisma:validate
```

Create and apply a development migration:

```bash
npm run prisma:migrate -- --name describe-change
```

The current migrations cover:

- Initial user authentication fields
- User roles
- Phone numbers for OTP authentication

## Local Development

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run postinstall
```

Run the server directly when PostgreSQL, Redis, and WAHA are available locally:

```bash
npm start
```

For normal development, Docker Compose is recommended because it supplies the complete service network and internal hostnames.

## Health Checks

API health endpoint:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"ok"}
```

Inspect service status:

```bash
docker compose ps
```

Inspect logs:

```bash
docker compose logs -f server
```

## Troubleshooting

### `502 Bad Gateway` from Nginx

The server may still be starting or waiting for Redis. Check:

```bash
docker compose ps
docker compose logs server redis nginx
```

The server health check must be healthy before Nginx routes requests.

### OTP returns `503`

The WAHA session is not connected. Open the WAHA dashboard, scan the QR code, and wait for `WORKING` status.

### OTP returns `409`

The email or phone number already belongs to a user. Use another value or inspect the local database.

### Migration confirmation prompt

Prisma may ask for confirmation when adding a unique phone constraint. Review the warning and confirm only when existing data is compatible.

### Rebuild after source changes

```bash
npm run docker:up -- -d --wait
```
