FROM node:22-alpine

WORKDIR /app

COPY package.json .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]