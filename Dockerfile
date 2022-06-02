FROM node:14-alpine

EXPOSE 3030 3333

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
