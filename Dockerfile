# Stage 1: Build the React frontend
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy backend files and the compiled frontend build
WORKDIR /app
COPY server/ ./server/
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "server/server.js"]
