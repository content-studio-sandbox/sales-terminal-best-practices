# Multi-stage build for frontend-only Vite app
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Final stage - serve with nginx
FROM nginx:alpine

# Copy built assets to nginx
COPY --from=builder /build/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]