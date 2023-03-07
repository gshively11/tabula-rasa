#!/bin/sh

set -e

if [ "$*" = "prep-litefs" ]; then
  # mount litefs first, then rerun the entrypoint to start the app
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

if [ "$*" = "e2e" ]; then
  # create an empty file that sqlite will use for the database
  mkdir /litefs
  touch /litefs/default.db
  # ensure the database is up to date and run any migrations that are needed
  npm run db-deploy
  # run the tests
  exec npx playwright test
  exit $?
fi

exec $@
