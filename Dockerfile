FROM node:23-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
RUN npm ci
COPY . .
RUN npm run backend:build

FROM node:23-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
RUN npm ci --omit=dev
COPY .env ./
COPY --from=builder /app/backend/build ./backend/build
CMD [ "npm", "run",  "backend:prod"]