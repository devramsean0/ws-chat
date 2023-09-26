FROM node:18-alpine as setup
WORKDIR /app
RUN apt install git -y
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .

FROM setup as build
RUN yarn install
RUN yarn Build

ARG PORT
ARG heartbeatTime
ARG authCode
FROM build as run
RUN yarn install -g .
EXPOSE 8080
CMD ["ws-chat", "server", "--port", "$PORT", "--heartbeatTime", "$heartbeatTime", "--authCode", "$authCode", "$heart"]