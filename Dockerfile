# Base image with Node.js installed
FROM node:18-alpine

# Create app directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port the app listens on (adjust as needed)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
