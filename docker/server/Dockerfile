# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY docker/server/package.json /temp/dev/
WORKDIR /temp/dev
RUN bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY docker/server/package.json /temp/prod/
WORKDIR /temp/prod
RUN bun install --frozen-lockfile --production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/prod/package.json .
COPY api api
COPY server server
COPY constants constants
COPY common common
COPY tsconfig.json .

# run the app
USER bun
ENTRYPOINT [ "bun", "run", "serve" ]
