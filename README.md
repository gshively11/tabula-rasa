# tabula-rasa

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/gshively11/tabula-rasa/tree/main.svg?style-svg)](https://dl.circleci.com/status-badge/redirect/gh/gshively11/tabula-rasa/tree/main)

A profile for Grant Shively, hosted at [ihopethis.works](https://ihopethis.works).

API documentation is available via a [Swagger UI](https://ihopethis.works/api-docs)

## Sources & Inspiration

- [Astrowind Template](https://github.com/onwidget/astrowind)

## Development

### Run Directly on Host Machine

- `npm run dev`: Start the project in dev mode with live reload.
- `npm run build`: Build the project.
- `npm run start`: Start the project using the last build.

### Run on Docker

- `make build`: Build the final docker image.
- `make test`: Build the base docker image and run tests.
- `make run`: Run the final docker image.

### Deploy

This project is deployed to [fly.io](https://fly.io) via [flyctl]( https://fly.io/docs/flyctl/).
Flyctl uses the Dockerfile to build and deploy the project.

- `npm run deploy`: Deploy to fly.io.

### Project Structure

```
/db/  ------------------- Holds the sqllite db file when running locally. Mounted volume when live.
/dist/  ----------------- Created during astro build
/dist_node/  ------------ Created during typescript build
/prisma/  --------------- Stores the prisma db schema and migration files
/public/  --------------- Contains raw assets that are hosted directly by astro
/scripts/  -------------- Stores development scripts
/src/  ------------------ App code
  api/ ------------------ API code
  assets/ --------------- Frontend assets that are processed by the build
  components/ ----------- Astro components
  content/ -------------- Astro static content
  layouts/ -------------- Astro layouts
  models/ --------------- Domain layer for the backend
  pages/ ---------------- Astro pages
  services/ ------------- Backend services
  utils/ ---------------- Frontend utilities
  errors.ts  ------------ Contains all custom errors
  frontend-config.mjs --- Configuration for the frontend
  frontend-data.js  ----- DRYs up data used by the frontend
  prisma.ts  ------------ Provides db client
  server.ts  ------------ Main file for the API server
```
