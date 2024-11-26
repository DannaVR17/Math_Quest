# Base image
FROM node:22.11.0 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen ligera para servir la aplicación
FROM nginx:alpine

# Copia el archivo de configuración personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto en el que Nginx escucha
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
