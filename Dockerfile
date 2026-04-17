# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build-time env vars — override with --build-arg
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for SPA routing + API proxy
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 3002;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # API proxy to backend (external URL)
    location /api/ {
        proxy_pass http://13.60.4.75:8002/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded media files proxy
    location /uploads/ {
        proxy_pass http://13.60.4.75:8002/uploads/;
        proxy_set_header Host $host;
    }

    # SPA fallback — all non-file routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Expose port
EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]
