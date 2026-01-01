FROM node:22-alpine

WORKDIR /app

# Install wget for healthchecks
RUN apk add --no-cache wget

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies using npm ci for faster, reliable, reproducible builds
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Make entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

# Change ownership to non-root user (wget is installed system-wide, so user can use it)
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 4000

# Use entrypoint script that seeds database if needed, then starts the server
ENTRYPOINT ["/app/docker-entrypoint.sh"]