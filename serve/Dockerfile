FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .

FROM base AS runner
WORKDIR /app

COPY --from=builder /app ./

ENV TZ=Asia/Bangkok
ENV NODE_ENV=production

EXPOSE 8080

CMD ["bun", "run", "start"]
