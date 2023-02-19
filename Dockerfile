##
# Base stage, install all dependencies.
# Target this stage for running tests.
#
FROM node:19-alpine AS base

WORKDIR /home/node/app

# install native dependencies
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./

# install dev dependencies, which are needed to build the app
RUN npm install

COPY . .

##
# Build stage, re-uses the base stage
# and builds the project
#
FROM base as build

WORKDIR /home/node/app

# build the app
RUN npx prisma generate
RUN npx astro build
RUN npx tsc -p tsconfig.node.json

##
# Prune stage, remove dev dependencies
#
FROM build AS pruner

WORKDIR /home/node/app

RUN npm prune --omit dev

##
# App stage, ready for deploy
#
FROM node:19-alpine as app

WORKDIR /home/node/app

COPY --from=flyio/litefs:pr-277 /usr/local/bin/litefs /usr/local/bin/litefs

# Add curl because it's useful
RUN apk add --no-cache curl

# overwrite the docker-entrypoint.sh from the node image with our own
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Switch to node user so we don't run as root
USER node

# copy the dependencies and dists from the builder stage
COPY --from=pruner --chown=node /home/node/app /home/node/app/

EXPOSE 3000

CMD ["node", "--max-old-space-size=200", "./dist_node/src/server.js"]
