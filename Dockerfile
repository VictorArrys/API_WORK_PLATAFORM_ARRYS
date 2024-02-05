FROM node:current-alpine3.16

COPY . /api

WORKDIR /api

# Copiar el archivo .env
COPY .env .env

RUN npm install

ENV PORT=5000
EXPOSE 5000

CMD [ "node", "ElCamelloAPI.js" ]