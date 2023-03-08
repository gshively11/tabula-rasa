##
# base-builder stage, install dependencies needed to build the project.
#
FROM node:19-alpine AS base-builder

WORKDIR /home/node/app

# install dependencies
RUN apk add --no-cache python3 make g++ curl fuse fuse3

COPY --from=flyio/litefs:main /usr/local/bin/litefs /usr/local/bin/litefs


##
# base-e2e stage, install dependencies needed by playwright to run E2E tests.
#
FROM base-builder as base-e2e

# Installs latest Chromium package.
RUN apk upgrade --no-cache --available \
    && apk add --no-cache \
      chromium-swiftshader \
      ttf-freefont \
      font-noto-emoji \
    && apk add --no-cache \
      --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing \
      font-wqy-zenhei

COPY local.conf /etc/fonts/local.conf

# overwrite the docker-entrypoint.sh from the node image with our own
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh


##
# base-app stage, install dependencies needed to run the app.
#
FROM node:19-alpine AS base-app

WORKDIR /home/node/app

# install dependencies
RUN apk add --no-cache curl fuse fuse3

COPY --from=flyio/litefs:main /usr/local/bin/litefs /usr/local/bin/litefs

# overwrite the docker-entrypoint.sh from the node image with our own
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh


##
# builder stage, re-uses the base-builder stage and builds the project
#
FROM base-builder as builder

WORKDIR /home/node/app

COPY package.json package-lock.json ./

# install dev dependencies, which are needed to build the app
RUN npm install

COPY . .

# build the app
RUN npx prisma generate
RUN npx astro build
RUN npx tsc -p tsconfig.node.json


##
# pruner stage, remove dev dependencies from node_modules
#
FROM builder AS pruner

WORKDIR /home/node/app

RUN npm prune --omit dev


##
# app stage, used to run the app
# Note: must run as root for litefs to work
#
FROM base-app as app

WORKDIR /home/node/app

# copy the dependencies and dists from the pruner stage
COPY --from=pruner /home/node/app /home/node/app/

EXPOSE 3000

# see docker-entrypoint.sh for available commands
CMD ["prep-litefs"]


##
# Optional e2e stage, used for headless browser end-to-end testing
# Inspired by https://github.com/Zenika/alpine-chrome/blob/master/Dockerfile

FROM base-e2e as e2e

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    CHROMIUM_FLAGS="--disable-software-rasterizer --disable-dev-shm-usage" \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# copy the dependencies and dists from the builder stage, so dev
# dependencies are still available
COPY --from=builder /home/node/app /home/node/app/

# expose HTML report
EXPOSE 9323

# see docker-entrypoint.sh for available commands
CMD ["e2e"]
