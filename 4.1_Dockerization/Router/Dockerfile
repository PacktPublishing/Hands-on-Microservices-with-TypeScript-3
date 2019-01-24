FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 3080

CMD [ "nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf" ]