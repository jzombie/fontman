FROM node:10
LABEL maintainer "jeremy.harris@zenosmosis.com"

RUN apt-get update && \
    apt-get install -y supervisor && \
    apt-get install -y nginx && \
    apt-get install -y zip && \
    apt-get clean

# icon-font-generator needs unsafe-perm set to true, or it will raise an error
# @see https://github.com/npm/npm/issues/17851#issuecomment-340677028
RUN npm config set unsafe-perm true && \
    npm install -g pm2 icon-font-generator && \
    npm config set unsafe-perm false

COPY supervisord/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx/default.conf /etc/nginx/sites-enabled/default

RUN useradd -ms /bin/bash user

WORKDIR /app

COPY ./ ./

EXPOSE 80

# RUN cd frontend && npm install && \
# cd ../backend && npm install

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]