#!/bin/sh
envsubst < /nginx.tpl > /etc/nginx/nginx.conf

nginx -g 'daemon off;'