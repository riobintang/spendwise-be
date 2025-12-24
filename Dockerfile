FROM node:24-alpine3.22 AS base

WORKDIR /app


FROM base AS build-deps
WORKDIR /app
COPY package*.json ./
COPY . .
RUN --mount=type=cache,target=/root/.npm,sharing=locked npm install
RUN npx prisma generate 
RUN npm run build

FROM base AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked npm ci --only=production

FROM base AS prod
WORKDIR /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build-deps /app/generated /app/generated
COPY --from=build-deps /app/dist /app/dist
COPY package*.json ./

EXPOSE 8080
CMD ["node", "dist/src/server.js"]