# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["npm", "run", "dev"]