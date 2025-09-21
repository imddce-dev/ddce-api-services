# Stage 1: Base
FROM oven/bun:1 AS base
WORKDIR /app

# ติดตั้ง dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2: Build + Migration
FROM base AS builder
WORKDIR /app
COPY . .

# รัน migration ตอน build
RUN bunx drizzle-kit push

# Stage 3: Production runner
FROM base AS runner
WORKDIR /app

# คัดลอกไฟล์โค้ดและ node_modules มาจาก builder
COPY --from=builder /app ./

# เปิดพอร์ต 8080
EXPOSE 8080

# รัน server (ต้องแน่ใจว่า Hono listen ที่ 0.0.0.0:8080)
CMD ["bun", "run", "start"]
