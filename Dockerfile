FROM alpine:latest

ENV PROJECT_LOCATION /usr/local/src/ioa-dashboard/

RUN apk add nodejs; \
    apk add npm; \
    npm i -g http-server

COPY . ${PROJECT_LOCATION}
WORKDIR ${PROJECT_LOCATION}

RUN npm i; \
    npm run build

WORKDIR build
EXPOSE 9993

ENTRYPOINT ["http-server","-p","9993"]
