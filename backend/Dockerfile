FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application (excluding node_modules via .dockerignore)
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
