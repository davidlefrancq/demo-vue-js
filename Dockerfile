# STEP 1 : Build
FROM node:lts-alpine AS build

# Install a simple http server to serve static content
RUN npm install -g http-server

# Set the 'app' folder as working directory
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy project files and folders to the working directory (e.g., the 'app' folder)
COPY src ./src
COPY public ./public
COPY env.d.ts ./
COPY index.html ./
COPY playwright.config.ts ./
COPY tsconfig.app.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY tsconfig.vitest.json ./
COPY vite.config.ts ./

# Build the project
RUN npm run build

# STEP 2 : Image finale, uniquement avec le build
FROM node:lts-alpine AS production

# Set the 'app' folder as working directory
WORKDIR /app

# Copy only the 'dist' folder from the 'build' stage
COPY --from=build /app/dist ./dist

# Command to run the app using http-server
EXPOSE 8080
CMD [ "http-server", "dist" ]