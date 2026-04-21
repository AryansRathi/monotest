ARG PLAYWRIGHT_VERSION=v1.58.2

FROM mcr.microsoft.com/playwright:${PLAYWRIGHT_VERSION}

WORKDIR /app

# Copy package files first for better caching
COPY package*.json .npmrc ./

# Install dependencies as root
RUN npm install --frozen-lockfile

# Copy the rest of the test files
COPY --chown=ubuntu:ubuntu . .

# Switch to the non-root user
USER ubuntu

ENTRYPOINT ["npx", "playwright", "test"]
