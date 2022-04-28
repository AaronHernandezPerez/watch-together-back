FROM node:16

WORKDIR /code/back
COPY package*.json ./

ENV NODE_ENV=development
RUN npm i
COPY . .
CMD npm run dev
