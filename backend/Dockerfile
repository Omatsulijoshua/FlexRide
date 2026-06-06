# Multi-stage build for NestJS microservices
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# The specific microservice entrypoint will be overridden in docker-compose.yml
CMD ["node", "dist/main.js"]
