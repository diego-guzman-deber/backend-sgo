# =============================================================================
# Stage 1 – deps
# Instala SOLO las dependencias de producción.
# Se cachea mientras package.json / pnpm-lock.yaml no cambien.
# =============================================================================
FROM node:22-alpine AS deps

# Habilitar corepack para usar pnpm sin instalarlo manualmente
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifiestos primero para aprovechar la caché de Docker
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Si el proyecto tiene schema de Prisma, descomentar las siguientes líneas:
# COPY prisma ./prisma
# RUN pnpm exec prisma generate

# =============================================================================
# Stage 2 – builder
# Compila el proyecto TypeScript a JavaScript.
# =============================================================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifiestos e instalar TODAS las dependencias (incluyendo devDeps)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Si el proyecto tiene schema de Prisma, descomentar las siguientes líneas:
# COPY prisma ./prisma
# RUN pnpm exec prisma generate

# Copiar el código fuente y archivos de configuración del compilador
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src

# Compilar TypeScript → JavaScript
RUN pnpm run build

# =============================================================================
# Stage 3 – runner (imagen final)
# Solo contiene el código compilado y las dependencias de producción.
# Imagen mínima (~200 MB vs ~1 GB con todo incluido).
# =============================================================================
FROM node:22-alpine AS runner

# Crear usuario no-root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

WORKDIR /app

# Copiar node_modules de producción desde stage 1
COPY --from=deps    --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copiar el build compilado desde stage 2
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copiar package.json (NestJS lo usa en runtime para resolver rutas)
COPY --chown=nestjs:nodejs package.json ./

# Si el proyecto tiene schema de Prisma, descomentar:
# COPY --chown=nestjs:nodejs prisma ./prisma

# Cambiar al usuario no-root
USER nestjs

# Puerto expuesto (debe coincidir con PORT en las variables de Dokploy)
EXPOSE 3000

# Variables de entorno por defecto (se sobreescriben desde Dokploy)
ENV NODE_ENV=production \
    PORT=3000

# Healthcheck: Dokploy usa esto para saber si el contenedor está listo
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:3000/api || exit 1

# Comando de inicio — node directamente, sin el CLI de NestJS (más rápido y ligero)
CMD ["node", "dist/main"]
