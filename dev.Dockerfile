FROM oven/bun:1.1.7

WORKDIR /app

COPY . .

RUN bun install --no-cache

# install node to monkeypatch weirdness with prisma
# install node lts and npm
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

RUN bun run prisma:generate 

CMD ["bun", "run", "dev"]