# Use Node
FROM node:20

# Set working dir to /app/backend inside the container
WORKDIR /app/backend

# Copy only package.json and lock file first (best practice)
COPY backend/package*.json ./

# Install deps
RUN npm install

# Now copy the whole backend folder into the container’s /app/backend
COPY backend/ ./

# Expose port if needed
EXPOSE 3000

# Run it
CMD ["npm", "start"]