#!/bin/sh

set -eu

cd "$(dirname "$0")/.."

generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "$1"
  else
    od -An -N "$1" -tx1 /dev/urandom | tr -d ' \n'
  fi
}

env_value() {
  key="$1"
  grep "^${key}=" .env 2>/dev/null | tail -n 1 | cut -d '=' -f 2- | sed 's/^"//; s/"$//' || true
}

set_env_value() {
  key="$1"
  value="$2"
  temporary_file=".env.tmp.$$"

  awk -v key="$key" -v value="$value" '
    BEGIN { updated = 0 }
    $0 ~ "^" key "=" {
      print key "=\"" value "\""
      updated = 1
      next
    }
    { print }
    END {
      if (!updated) print key "=\"" value "\""
    }
  ' .env 2>/dev/null > "$temporary_file" || {
    printf 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fin_anchor?schema=public"\n' > "$temporary_file"
    printf '%s="%s"\n' "$key" "$value" >> "$temporary_file"
  }

  mv "$temporary_file" .env
}

username="$(env_value WAHA_DASHBOARD_USERNAME)"
password="$(env_value WAHA_DASHBOARD_PASSWORD)"
api_key="$(env_value WAHA_API_KEY)"
jwt_secret="$(env_value JWT_SECRET)"
otp_hmac_secret="$(env_value OTP_HMAC_SECRET)"

[ -n "$username" ] || username="waha_$(generate_secret 4)"
[ -n "$password" ] || password="$(generate_secret 24)"
[ -n "$api_key" ] || api_key="$(generate_secret 16)"
[ -n "$jwt_secret" ] || jwt_secret="$(generate_secret 32)"
[ -n "$otp_hmac_secret" ] || otp_hmac_secret="$(generate_secret 32)"

set_env_value WAHA_API_KEY "$api_key"
set_env_value JWT_SECRET "$jwt_secret"
set_env_value OTP_HMAC_SECRET "$otp_hmac_secret"
set_env_value WAHA_DASHBOARD_USERNAME "$username"
set_env_value WAHA_DASHBOARD_PASSWORD "$password"
set_env_value WHATSAPP_SWAGGER_USERNAME "$username"
set_env_value WHATSAPP_SWAGGER_PASSWORD "$password"

chmod 600 .env

echo "WAHA credentials stored in .env"
docker compose up --build "$@"