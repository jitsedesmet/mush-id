FROM node:latest AS builder
LABEL authors="jitsedesmet"

WORKDIR /var/www/mush-id

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM httpd:2

COPY --from=builder /var/www/mush-id/build /usr/local/apache2/htdocs

# Enable mod_headers (for Cache-Control) and configure SPA routing
RUN sed -i \
    -e 's/#LoadModule headers_module/LoadModule headers_module/' \
    /usr/local/apache2/conf/httpd.conf

COPY apache.conf /usr/local/apache2/conf/extra/spa.conf

RUN echo "Include conf/extra/spa.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
