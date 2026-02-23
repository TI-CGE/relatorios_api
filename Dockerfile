FROM oven/bun:debian

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile

COPY . .

EXPOSE 3000

ENV PORT=3000

CMD ["bun", "run", "src/index.ts"]
