FROM node:lts-alpine as build-stage
ARG nobuild

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install

COPY . /app
RUN if [ "x$nobuild" = "x" ] ; then npm run build; fi
# RUN npm run build

EXPOSE 8080
