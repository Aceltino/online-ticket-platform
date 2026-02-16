import 'dotenv/config';
import { defineConfig } from 'prisma/config'; // Importe de 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
