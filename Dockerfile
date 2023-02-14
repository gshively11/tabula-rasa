FROM flyio/litefs:pr-277 AS litefs

##
# Builder stage, install dependencies and build
#
FROM node:19-alpine AS builder

WORKDIR /home/node/app

# install native dependencies
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./

# install dev dependencies, which are needed to build the app
RUN npm install

COPY . .

# build the app
RUN npx astro build
RUN npx tsc -p tsconfig.node.json

# remove the dev dependencies
RUN npm prune --production

##
# Final stage
#
FROM node:19-alpine

# Add curl because it's useful
RUN apk add --no-cache curl

USER node
WORKDIR /home/node/app

# copy the dependencies and dists from the builder stage
COPY --from=builder /home/node/app /home/node/app/

EXPOSE 3000

CMD ["node", "--max-old-space-size=200", "./dist_node/index.js"]
