# Use official Node.js image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your NestJS app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start:prod"]
