FROM node:latest-alpine as Setup
WORKDIR /app
RUN apt install git -y
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .

FROM Setup as Build
RUN yarn install
RUN yarn Build

ARG PORT
ARG heartbeatTime
ARG authCode
FROM Build as Run
RUN yarn install -g .
EXPOSE 8080
CMD ["ws-chat", "server", "--port", "$PORT", "--heartbeatTime", "$heartbeatTime", "--authCode", "$authCode", "$heart"]