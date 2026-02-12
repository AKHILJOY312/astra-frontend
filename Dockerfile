# FROM node:20-alpine AS builder

# WORKDIR /app

# # Install deps first (better caching)
# COPY package.json package-lock.json* ./
# RUN npm install

# # Copy source
# COPY . .

# # Build Vite app
# RUN npm run build

# build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# serve stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

