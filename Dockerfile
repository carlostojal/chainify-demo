FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1234/udp 
EXPOSE 3000/tcp

ENTRYPOINT [ "npm", "start" ]
