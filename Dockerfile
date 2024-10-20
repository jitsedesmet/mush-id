FROM node:latest
LABEL authors="jitsedesmet"

WORKDIR /var/www/mush-id
VOLUME /var/www/mush-id-data

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
