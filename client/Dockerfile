FROM node:18-alpine3.17 as intermediate

ENV NODE_VERSION 18.18.2


# Create application directory
WORKDIR /app

# Install application data
COPY . ./

# Add git
RUN apk update && apk upgrade && apk add --no-cache bash git openssh

# Install application dependencies
RUN npm install

FROM node:18-alpine3.17

# Create application directory
WORKDIR /app

# Copy the app form the previous image
COPY --from=intermediate /app /app

# Expose API port and run application
EXPOSE 5137
CMD [ "npm", "start", "--", "--host", "0.0.0.0"  ]