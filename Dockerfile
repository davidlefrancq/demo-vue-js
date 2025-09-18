FROM node:lts-alpine

# install a simple http server to serve static content
RUN npm install -g http-server

# set the 'app' folder as working directory
WORKDIR /app

# copy 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm ci

# copy project files and folders to the working directory (e.g., the 'app' folder)
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

# construit l'app pour la production en la minifiant
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]