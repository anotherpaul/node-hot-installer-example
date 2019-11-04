FROM keymetrics/pm2:latest-alpine

RUN mkdir /package-loader
RUN mkdir /worker

COPY ./package-loader/package.json /package-loader/package.json
COPY ./package-loader/package-lock.json /package-loader/package-lock.json
RUN cd /package-loader && npm install --production

COPY ./worker/package.json /worker/package.json
COPY ./worker/package-lock.json /worker/package-lock.json
RUN cd /worker && npm install --production

COPY pm2.config.js .

COPY ./package-loader/src /package-loader/src/
COPY ./worker/src /worker/src

CMD ["pm2-runtime", "start", "pm2.config.js"]