FROM node:24-alpine3.22 AS base

WORKDIR /app
COPY . .

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install && npx prisma generate

FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM base AS prod
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/generated /app/generated
COPY --from=build /app/dist /app/dist

EXPOSE 8080
CMD ["node", "/"]