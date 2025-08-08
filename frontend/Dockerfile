FROM node:23-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
RUN npm ci
COPY ./frontend ./frontend
COPY ./tsconfig.json ./tsconfig.json
RUN npm run frontend:build

FROM node:23-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
RUN npm ci --omit=dev
COPY .env ./
COPY --from=builder /app/frontend/build ./frontend/build
CMD [ "npm", "run",  "frontend:prod"]