#!/bin/sh

set -eu

npx prisma migrate deploy
exec node app.js