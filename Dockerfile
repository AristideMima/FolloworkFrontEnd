### STAGE 1: Build ###
FROM node:14.19.0-alpine3.15 AS build
WORKDIR /usr/src/app
COPY package.json ./
#COPY ./node_modules ./node_modules
RUN yarn install
#RUN npm install --save --legacy-peer-deps
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.21.5-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/follow-ui /usr/share/nginx/html
EXPOSE 80
