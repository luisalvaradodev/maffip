FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=vmstore

# Copy the dump file to docker-entrypoint-initdb.d
# Files in this directory are executed on container startup
COPY dump.sql /docker-entrypoint-initdb.d/