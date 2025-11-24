FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build can happen here or at runtime
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]