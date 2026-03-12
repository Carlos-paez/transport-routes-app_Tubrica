# Usamos la imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instalamos la librería de desarrollo de sqlite3 en el sistema operativo
# Pero NO intentamos reinstalar las extensiones de PHP que ya vienen incluidas
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Habilitamos el módulo de reescritura de Apache
RUN a2enmod rewrite

# Copiamos los archivos de la aplicación
COPY . /var/www/html/

# Ajustamos permisos para que Apache (www-data) pueda escribir en la DB y crear archivos temporales
RUN chown -R www-data:www-data /var/www/html/ \
    && chmod -R 775 /var/www/html/

EXPOSE 80