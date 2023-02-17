#!/bin/sh

set -e

# shortcut to open shell instead of run app
if [ "$*" = "shell" ]; then
  exec /bin/sh
  exit 0
fi

# ensure the database is up to date with all migrations
npm run db-deploy

exec "$@"
