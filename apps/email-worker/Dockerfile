# --- ETAPA 1: BUILD ---
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json nx.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build del Worker
RUN npx nx build email-worker --configuration=production

# --- ETAPA 2: RUNNER ---
FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copiamos artefacto del worker
COPY --from=builder /app/dist/apps/email-worker ./dist/apps/email-worker

USER node
CMD ["node", "dist/apps/email-worker/main.js"]
