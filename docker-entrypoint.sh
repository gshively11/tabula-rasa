#!/bin/sh

set -e

if [ "$*" = "prep-litefs" ]; then
  if [ "$LITEFS_STATIC" = "1" ]; then
    # need to use static leasining instead of consul when running locally
    cp ./litefs-local.yml ./litefs.yml
  fi
  # ensure the database is up to date with all migrations
  exec litefs mount -- sh ./docker-entrypoint.sh run-tabula-rasa
  exit $?
fi

if [ "$*" = "run-tabula-rasa" ]; then
  # ensure the database is up to date and run any migrations that are needed
  npm run db-deploy
  # start the application
  exec node --max-old-space-size=200 ./dist_node/src/server.js
  exit $?
fi

# shortcut to open shell instead of run app
if [ "$*" = "shell" ]; then
  exec /bin/sh
  exit $?
fi
