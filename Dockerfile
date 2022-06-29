FROM node:10-alpine

COPY . /api

WORKDIR /api

RUN npm install

ENV PORT=5000
EXPOSE 5000
EXPOSE 80

CMD [ "node", "ElCamelloAPI.js" ]