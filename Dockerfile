FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment for ARM64 compatibility
ENV NODE_OPTIONS="--max_old_space_size=2048"

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Expose port
EXPOSE 4200

# For development, run ng serve with correct flags for current Angular version
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"] 