FROM nginx:alpine

# Copiar configuración personalizada de Nginx (puerto 8000)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el sitio estático
COPY . /usr/share/nginx/html

EXPOSE 8000