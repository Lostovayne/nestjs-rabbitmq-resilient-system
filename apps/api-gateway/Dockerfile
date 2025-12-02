# --- ETAPA 1: BUILD ---
FROM node:22-alpine AS builder

# Ya no instalamos pnpm. Node viene con npm.
# Instalamos dependencias de sistema por si acaso (python, make, g++)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 1. Copiamos package-lock.json en lugar de pnpm-lock.yaml
COPY package.json package-lock.json nx.json ./

# 2. Instalación limpia con NPM
RUN npm ci --legacy-peer-deps

# 3. Copiamos el código
COPY . .

# 4. Build
RUN npx nx build api-gateway --configuration=production

# --- ETAPA 2: RUNNER ---
FROM node:22-alpine AS runner

WORKDIR /app

# 1. Copiamos package-lock.json
COPY package.json package-lock.json ./

# 2. Instalamos solo producción (--omit=dev es el estándar moderno)
RUN npm ci --omit=dev --legacy-peer-deps

# 3. Copiamos el artefacto compilado
COPY --from=builder /app/dist/apps/api-gateway ./dist/apps/api-gateway

USER node
EXPOSE 3000
CMD ["node", "dist/apps/api-gateway/main.js"]
