FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove the default nginx page
RUN rm -rf ./*

COPY dist/fuse .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]