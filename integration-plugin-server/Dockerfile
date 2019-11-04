FROM keymetrics/pm2:latest-alpine

COPY package.json .
COPY package-lock.json .
RUN npm install --production

COPY pm2.config.js .

COPY src src/

CMD ["pm2-runtime", "start", "pm2.config.js"]