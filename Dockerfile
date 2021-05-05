FROM nginx:alpine

RUN apk add --update --no-cache \
  automake \
  bash \
  git \
  nodejs \
  nodejs-npm \
  yarn \
  && rm -rf /var/cache/apk/*

COPY dist usr/share/nginx/html
WORKDIR usr/share/nginx/html

#RUN rm -rf node_modules/
#
#RUN npm cache clean --force
#
#RUN npm install


EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
