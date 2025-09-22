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

EXPOSE 8080

CMD ["bun", "run", "start"]
