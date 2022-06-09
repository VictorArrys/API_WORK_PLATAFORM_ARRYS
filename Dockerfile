FROM node:10-alpine

COPY . /api

WORKDIR /api

RUN npm install

EXPOSE 5000

CMD [ "node", "index.js" ]