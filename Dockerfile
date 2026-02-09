FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build Vite app
RUN npm run build