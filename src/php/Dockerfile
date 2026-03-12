# Imagen base de PHP con Apache
FROM php:8.2-apache

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Habilitar módulos de Apache necesarios
RUN a2enmod rewrite headers

# Configurar Apache para permitir .htaccess
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Configurar ServerName para evitar warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copiar archivos de la aplicación
COPY . /var/www/html/

# Crear directorio para la base de datos si no existe
RUN mkdir -p /var/www/html/

# Ajustar permisos para que Apache pueda escribir en la base de datos
RUN chown -R www-data:www-data /var/www/html/ \
    && chmod -R 755 /var/www/html/ \
    && chmod 777 /var/www/html/ \
    && touch /var/www/html/routes.db \
    && chmod 666 /var/www/html/routes.db

# Exponer puerto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Comando de inicio
CMD ["apache2-foreground"]