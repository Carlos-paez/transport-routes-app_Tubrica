# Imagen base de Node.js
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto de la aplicación
COPY . .

# Crear directorio para la base de datos con permisos
RUN mkdir -p /app/data && chmod 777 /app/data

# Exponer el puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
