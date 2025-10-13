# ==============================
# 1️⃣ Builder Stage
# ==============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build tools)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build


# ==============================
# 2️⃣ Production Stage
# ==============================
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/main"]
