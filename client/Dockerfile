# Stage 1: Build the React/Vite application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Accept build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app explicitly
RUN npm run build

# Stage 2: Serve the build static files with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the static assets from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Add a custom nginx configuration to handle React Router client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
