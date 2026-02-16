FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia os arquivos de configuração da raiz do projeto
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copia as pastas necessárias usando caminhos relativos à raiz do projeto
COPY libs ./libs
COPY apps/identity-service ./apps/identity-service

RUN pnpm install --frozen-lockfile

# Copia o restante (incluindo tsconfigs da raiz)
COPY . .

RUN DATABASE_URL="postgresql://identity_user:identity_pass@localhost:5432/identity_db" pnpm --filter @org/identity-service exec prisma generate
EXPOSE 3000

# No seu apps/identity-service/Dockerfile, altere a última linha:

CMD ["sh", "-c", "pnpm --filter @org/identity-service exec prisma db push && pnpm exec tsx --tsconfig apps/identity-service/tsconfig.app.json --env-file=apps/identity-service/.env apps/identity-service/src/main.ts"]