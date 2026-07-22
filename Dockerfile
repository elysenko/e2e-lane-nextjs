# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine

# Copy placeholder static site
COPY index.html /usr/share/nginx/html/index.html

# Default nginx config listens on 80 and serves /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
