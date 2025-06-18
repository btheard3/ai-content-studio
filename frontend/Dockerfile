# Build stage
FROM node:20 AS builder
WORKDIR /app

# Copy everything including the .env file
COPY . .
COPY .env .env  

RUN npm install && npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


