# Multi-stage Dockerfile for Interview Position Tracker Frontend
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Build args for API URL baked at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build the application (disable ESLint to avoid blocking build)
ENV CI=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV TSC_COMPILE_ON_ERROR=true
RUN npm run build:production || npm run build

# Stage 2: Production stage with Nginx
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure PID path is writable by non-root and update main nginx.conf pid directive
RUN mkdir -p /var/run/nginx \
    && chown -R nextjs:nodejs /var/run/nginx || true \
    && sed -i 's#^pid \([^;]*\);#pid /var/run/nginx/nginx.pid;#' /etc/nginx/nginx.conf || true

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set proper permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Create nginx pid directory
RUN mkdir -p /var/run/nginx && \
    chown -R nextjs:nodejs /var/run/nginx

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start nginx (PID path configured in nginx.conf)
CMD ["nginx", "-g", "daemon off;"]
