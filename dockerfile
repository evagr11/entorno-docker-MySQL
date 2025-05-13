# Este archivo contiene las instrucciones para construir la imagen 
# de Docker que se usará para crear el contenedor de MySQL.

FROM mysql:latest

# Variables de entorno (ajústalas a tu gusto)
ENV MYSQL_ROOT_PASSWORD=pass1234
ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=diego
ENV MYSQL_PASSWORD=secret1234

# Copia el script de inicialización al directorio de entrada de MySQL
COPY paneldb_dump.sql /docker-entrypoint-initdb.d/

# Copia el archivo de configuración personalizado
COPY mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf

# Exponer el puerto 3306
EXPOSE 3306

