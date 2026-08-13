FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
