# Imagen unica para SMAA: compila el backend Spring Boot y sirve el frontend con Nginx.
# MySQL se mantiene como contenedor separado para conservar datos y facilitar administracion.

FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /build

COPY smaa-backend/pom.xml ./pom.xml
RUN mvn -q -DskipTests dependency:go-offline

COPY smaa-backend/src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-jammy

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx netcat-openbsd ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-build /build/target/*.jar /app/smaa-backend.jar
COPY smaa-frontend/ /usr/share/nginx/html/
COPY nginx-single.conf /etc/nginx/sites-available/default
COPY docker/start-single-container.sh /app/start.sh

RUN chmod +x /app/start.sh \
    && rm -f /usr/share/nginx/html/Dockerfile \
    && rm -f /usr/share/nginx/html/nginx.conf \
    && rm -f /usr/share/nginx/html/.dockerignore

EXPOSE 80

ENTRYPOINT ["/app/start.sh"]
