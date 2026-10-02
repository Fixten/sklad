FROM node:24-alpine AS base
ENV CI=true

# ---------------------------------------------------------------------------
# fetch: download every package in the lockfile into a cached store.
FROM base AS fetch
WORKDIR /usr/src/app

# install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:/pnpm:$PATH"
RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm fetch --store-dir /var/cache/pnpm

# ---------------------------------------------------------------------------
FROM fetch AS build

# better-sqlite3 compiles from source; `fetch` only downloads tarballs, so the
# toolchain is needed here, in the stage that actually runs a full install
RUN apk add --no-cache python3 make g++

COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --store-dir /var/cache/pnpm --frozen-lockfile --offline

# the whole workspace at once: every project the lockfile records is on disk
COPY . .

# the frontend bakes its API config into the bundle at build time
ARG BACKEND_PORT
ARG FRONTEND_PORT
ARG VITE_BACKEND_URL
ENV BACKEND_PORT=$BACKEND_PORT
ENV FRONTEND_PORT=$FRONTEND_PORT
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN pnpm run -r build

RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend

# ---------------------------------------------------------------------------
FROM base AS backend
WORKDIR /prod/backend
COPY --from=build /usr/src/app/backend/public ./public
COPY --from=build /prod/backend/build ./build
COPY --from=build /prod/backend/node_modules ./node_modules
COPY --from=build /prod/backend/package.json ./package.json
COPY --from=build /usr/src/app/features.config.json /prod/features.config.json
CMD [ "./node_modules/.bin/pm2-runtime", "build/index.js" ]

# ---------------------------------------------------------------------------

FROM base AS frontend
WORKDIR /prod/frontend
COPY --from=build /usr/src/app/frontend/dist ./dist
COPY --from=build /prod/frontend/server.js ./server.js
COPY --from=build /prod/frontend/node_modules ./node_modules
COPY --from=build /prod/frontend/package.json ./package.json
CMD [ "./node_modules/.bin/pm2-runtime", "server.js" ]
