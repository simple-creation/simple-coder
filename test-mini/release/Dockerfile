FROM nginx
# COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/h5 /usr/share/nginx/html
COPY ./release/nginx.conf /etc/nginx/nginx.conf
RUN  cd /usr/share/nginx/html && ls
WORKDIR /usr/share/nginx/html
CMD ["nginx","-g","daemon off;"]


