# tabula-rasa

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/gshively11/tabula-rasa/tree/main.svg?style-svg)](https://dl.circleci.com/status-badge/redirect/gh/gshively11/tabula-rasa/tree/main)

A profile for Grant Shively, hosted at [ihopethis.works](https://ihopethis.works).

API documentation is available via a [Swagger UI](https://ihopethis.works/api-docs)

## Sources & Inspiration

- [Astrowind Template](https://github.com/onwidget/astrowind)

## Architecture

`tabula-rasa` is a web application running as a mixture of [Jamstack](https://en.wikipedia.org/wiki/Jamstack) and server-side rendering, backed by a REST and WebSocket API. It uses the following technologies:

- [Node.js](https://nodejs.org/en/): A JavaScript runtime that runs our web application.
- [Astro](https://astro.build/): A _fast_ web framework that supports static site generation (SSG) and server-side rendering (SSR).
- [Svelte](https://svelte.dev/): A web framework for building interactive web applications. We use Svelte to build dynamic components that run in Astro Islands.
- [Express](https://expressjs.com/): Yet another web framework! We use it to host Astro, a REST API, and a WebSocket API.
- [Prisma](https://www.prisma.io/): A Node.js ORM that has first-class support for TypeScript.
- [fly.io](https://fly.io/): A hosting provider with a generous free tier that runs full stack applications in regions all over the world. It provides an amazing user experience.
- [SQLite](https://www.sqlite.org/index.html): A small, fast, self-contained SQL database. We run SQLite in-process with our web application using [node-sqlite3](https://github.com/TryGhost/node-sqlite3).
- [socket.io](https://socket.io/): A library for bi-directional communication over HTTP and WebSockets.
- [nanostores](https://github.com/nanostores/nanostores): A tiny state manager that supports many web frameworks. We use it to share state between Svelte components.
- [Swagger](https://swagger.io/): Tools to document and visualize APIs. We host a Swagger UI at [https://ihopethis.works/api-docs](https://ihopethis.works/api-docs)

## Development

### Run Directly on Host Machine

- `npm run dev`: Start the project in dev mode with live reload. This only runs the Astro web application and not the Express APIs. Useful for a quick feedback loop while designing and styling the UI.
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
  components/ ----------- Astro/Svelte components
  content/ -------------- Astro static content
  layouts/ -------------- Astro layouts
  models/ --------------- Domain layer for the backend
  nanotstores/ ---------- Holds the nanostores that manage state for Astro/Svelte components
  pages/ ---------------- Astro pages
  services/ ------------- Backend services
  utils/ ---------------- Frontend utilities
  errors.ts  ------------ Contains all custom errors
  frontend-config.mjs --- Configuration for the frontend
  frontend-data.js  ----- DRYs up data used by the frontend
  prisma.ts  ------------ Provides db client
  server.ts  ------------ Main file for the API server
/tests/  ---------------- End-to-end tests using Playwright
  /__screenshots__/  ---- Stores Playwright screenshots. Mounted as a volume when running `make e2e`
```

### Dependencies

- `limax` is locked at `2.1.0` because later versions have issues with building native dependencies
- `svgo` is locked at `2.8.0` because later versions have issues with astro icons
