FROM node:16 as build
RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN yarn
RUN yarn build

FROM nginx:1.21.6
RUN mkdir /app
COPY --from=build /app/build /app
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf