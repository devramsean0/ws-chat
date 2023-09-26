FROM node:18 as setup
WORKDIR /app
RUN apt install git -y
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .

FROM setup as build
RUN yarn install
RUN yarn build

ARG heartbeatTime
ARG PORT
ARG authCode
FROM build as run
RUN npm install -g .
EXPOSE 8080
CMD ["ws-chat", "server", "--port $PORT", "--heartbeatTime", "$heartbeatTime", "--authCode", "$authCode", "$heart"]