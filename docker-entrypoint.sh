#!/bin/sh

set -e

# ensure the database is up to date with all migrations
npm run db-deploy

exec "$@"
