# ATLAS API image (the optional ECS Fargate path — Option A deploys from source
# on Render/Railway and needs no Docker). Multi-stage: build the workspace, then
# run the bundled server on a slim Alpine runtime.

FROM node:22-alpine AS build
# openssl + libc6-compat are required by Prisma's engine on Alpine (musl).
RUN apk add --no-cache openssl libc6-compat && corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile
# Generates the Prisma client (incl. the linux-musl engine) via postinstall,
# then bundles the server (tsup inlines @atlas/types).
RUN pnpm --filter @atlas/api build

FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl libc6-compat
ENV NODE_ENV=production
WORKDIR /repo
# Copy the whole tree so pnpm's symlinked node_modules resolve unchanged.
COPY --from=build /repo /repo

WORKDIR /repo/apps/api
EXPOSE 4000
# Apply migrations, then start the bundled server. (In ECS you'd usually run
# migrations as a separate one-off task rather than at container start.)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
