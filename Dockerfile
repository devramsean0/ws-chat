FROM node:22 as setup
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
COPY .* ./
COPY . .
RUN apt update
RUN apt install wait-for-it -y

FROM setup as build
RUN yarn install
ARG databaseURL
ENV DATABASE_URL=${databaseURL}
RUN yarn prisma migrate deploy
RUN yarn prisma generate
RUN yarn build

FROM build as run
ARG port
ARG heartbeatTime
ARG authCode
RUN npm install -g .
EXPOSE 8080
CMD ["yarn", "start"]