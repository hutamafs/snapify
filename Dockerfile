# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Install build tools for bcrypt native binding
RUN apk add --no-cache python3 make g++

# Copy only dependency definitions first
COPY package.json ./
COPY package-lock.json ./

# Install everything inside container
RUN npm install

# Now copy the full app
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
