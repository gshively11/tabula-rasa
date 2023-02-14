# tabula-rasa

A profile for Grant Shively, hosted at [ihopethis.works](https://ihopethis.works).

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
