FROM node:latest AS builder
LABEL authors="jitsedesmet"

WORKDIR /var/www/mush-id

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM httpd:2 AS runner

COPY --from=builder /var/www/mush-id/build /usr/local/apache2/htdocs
