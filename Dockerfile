# Use the latest Node.js image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code into the container
COPY . .

# 6. Build the Nest.js app
RUN npm install @sentry/nestjs --save --legacy-peer-deps
RUN npm install @nestjs/jwt --legacy-peer-deps

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
