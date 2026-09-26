FROM node:24-bookworm-slim AS deps

WORKDIR /app

# Install openssl for Prisma and any native deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install all dependencies (including dev) so Prisma is available for migrations
RUN npm ci --ignore-scripts

COPY . .

# prisma generate only needs a syntactically valid URL to select the right
# client — it never connects to the DB at build time
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npm run postinstall

# ---- final image ----
FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Copy only what the runtime needs
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy app source and the generated Prisma client from the build stage
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

CMD ["docker-entrypoint.sh"]
