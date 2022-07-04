FROM node:16.14.2

WORKDIR /app

COPY package*.json .
COPY yarn.lock .
COPY . .

RUN yarn install
EXPOSE 5000

ENV PORT=5000
ENV STORAGE_PATH="/storage"

RUN yarn build

CMD node dist/index