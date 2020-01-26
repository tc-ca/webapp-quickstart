FROM node:lts-alpine

WORKDIR /app
COPY ./app/package.json /app/package.json
COPY ./app/package-lock.json /app/package-lock.json
ENV NODE_ENV=production
RUN npm install

COPY ./app/ /app
RUN npm run build

ARG PORT=80
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["npm", "run", "start"]
