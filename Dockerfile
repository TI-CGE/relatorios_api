FROM oven/bun:debian

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY . .

EXPOSE 3333

ENV PORT=3333

CMD ["bun", "run", "src/index.ts"]
