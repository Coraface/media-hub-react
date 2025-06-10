# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Ensure ownership and permissions
RUN chown -R node:node /app
RUN chmod +x /app/node_modules/.bin/vite

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Switch to a non-root user
USER node

# Expose the port the app runs on
EXPOSE 5173

# Command to run the app
CMD ["vite", "--host"]
