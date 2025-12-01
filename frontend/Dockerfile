# syntax=docker.io/docker/dockerfile:1

# Use Node.js 20 LTS (Alpine for smaller image size)
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application with production API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8080}
RUN echo "Using API URL: $NEXT_PUBLIC_API_URL"

# Create .next/cache directory
RUN mkdir -p .next/cache
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create necessary directories
RUN mkdir -p /app/.next/cache
RUN mkdir -p /app/.next/static
RUN chown nextjs:nodejs /app/.next/cache
RUN chown nextjs:nodejs /app/.next/static

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Set the user to non-root
USER nextjs

# Start the application
CMD ["node", "server.js"]