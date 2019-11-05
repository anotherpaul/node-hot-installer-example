FROM node:alpine as react-build
WORKDIR /app
COPY ./package.json ./
RUN yarn
COPY ./public ./public
COPY ./src ./src
RUN yarn build

FROM nginx:alpine
COPY ./nginx/nginx.conf /nginx.tpl
COPY ./start.sh /start.sh
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["/start.sh"]