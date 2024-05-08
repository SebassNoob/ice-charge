FROM oven/bun:1.1.7

WORKDIR /app

COPY . .

RUN bun install --no-cache
RUN bun run build


CMD ["bun", "run", "start"]