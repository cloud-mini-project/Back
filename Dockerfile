# syntax=docker/dockerfile:1.0.0
FROM node:latest

# Builder information
LABEL mainbuilder="Choigunwoo <gunwoo8873@outlook.kr>"
LABEL description="Node Server"

COPY /public/. .
COPY /src/. .

COPY /package.json .
RUN npm i --save

EXPOSE 80800
EXPOSE 88888

CMD []