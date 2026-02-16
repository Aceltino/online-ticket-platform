FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia arquivos de build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY libs ./libs
COPY apps/api-gateway ./apps/api-gateway

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8080

# Forçamos o HOST via ENV para garantir que o Express ouça a rede Docker
ENV HOST=0.0.0.0
ENV PORT=8080

CMD ["pnpm", "--filter", "@org/api-gateway", "exec", "tsx", "src/main.ts"]