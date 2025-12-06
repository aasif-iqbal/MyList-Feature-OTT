# ========= BUILD STAGE =========
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY tests ./tests
RUN npm run build || echo "TypeScript build (optional for dev)"

# ========= RUNTIME STAGE =========
FROM node:20-alpine AS runtime
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts (if you add a build step later)
COPY --from=builder /app/dist ./dist
COPY src ./src
COPY seed ./seed

# Create non-root user
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nodejs
USER nodejs

EXPOSE 3000
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "src/app.ts"]