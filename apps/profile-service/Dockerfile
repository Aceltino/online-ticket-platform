FROM node:20-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia arquivos base do monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copia libs e app específico
COPY libs ./libs
COPY apps/profile-service ./apps/profile-service

# Instala dependências
RUN pnpm install --frozen-lockfile

# Copia restante do projeto (tsconfig, etc)
COPY . .

# Prisma generate (IMPORTANTE usar postgres como host)
RUN DATABASE_URL="postgresql://identity_user:identity_pass@postgres:5432/profile_db?schema=public" \
    pnpm --filter @org/profile-service exec prisma generate

EXPOSE 3001

CMD ["sh", "-c", "pnpm --filter @org/profile-service exec prisma db push && pnpm exec tsx --tsconfig apps/profile-service/tsconfig.app.json --env-file=apps/profile-service/.env apps/profile-service/src/main.ts"]
