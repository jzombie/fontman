FROM node:10
LABEL maintainer "jeremy.harris@zenosmosis.com"

RUN apt-get update && \
    apt-get install -y supervisor && \
    apt-get install -y nginx && \
    apt-get install -y zip && \
    apt-get clean

RUN npm install -g pm2 icon-font-generator

COPY supervisord/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx/default.conf /etc/nginx/sites-enabled/default

RUN useradd -ms /bin/bash user

WORKDIR /app

COPY ./ ./

# RUN cd frontend && npm install && \
# cd ../backend && npm install

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]