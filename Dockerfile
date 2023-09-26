FROM node:18 as setup
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .

FROM setup as build
RUN yarn install
RUN yarn build

FROM build as run
ARG port
ARG heartbeatTime
ARG authCode
RUN npm install -g .
EXPOSE 8080
CMD ["ws-chat", "server", "--port $PORT", "--heartbeatTime $heartbeatTime", "--authCode $authCode"]