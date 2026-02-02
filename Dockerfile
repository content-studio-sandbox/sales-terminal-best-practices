# Multi-stage build for fullstack app (matching your-projects pattern)
FROM node:20-alpine AS builder

WORKDIR /build

# Copy root package files for frontend
COPY package*.json ./
RUN npm ci

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Build backend
WORKDIR /build/api
COPY api/package*.json ./
RUN npm ci --only=production

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy frontend build
COPY --from=builder /build/dist ./dist

# Copy backend
COPY --from=builder /build/api ./api
COPY api/server.js ./api/

# Install backend dependencies in final image
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci --only=production

WORKDIR /app

# Expose port
EXPOSE 3000

# Start the backend server (which also serves the frontend)
CMD ["node", "api/server.js"]