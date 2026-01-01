# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Install serve globally to serve static files
RUN npm install -g serve@14.2.1 && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Switch to non-root user
USER nodejs

EXPOSE 5173

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "5173"]