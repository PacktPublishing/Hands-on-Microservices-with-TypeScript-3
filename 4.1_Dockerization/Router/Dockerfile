FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf" ]