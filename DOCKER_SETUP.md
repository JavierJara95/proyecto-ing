# Ejecucion Docker - SMAA con imagen unica

Esta version del proyecto usa una sola imagen Docker propia llamada `smaa-app`, que contiene:

- Frontend HTML/CSS/JS servido por Nginx.
- Backend Spring Boot ejecutandose dentro del mismo contenedor.
- Proxy interno Nginx para redirigir `/api` al backend.

La base de datos MySQL se mantiene en un contenedor separado para conservar datos y facilitar administracion.

## 1. Requisitos previos

- Docker Desktop instalado y abierto.
- Puerto 80 disponible en el computador.
- Computador y celular conectados a la misma red WiFi si se desea probar desde el telefono.

## 2. Levantar el sistema

Desde la carpeta principal del proyecto ejecutar:

```bash
docker compose up -d --build
```

Esto creara principalmente:

```text
smaa-app    -> frontend + backend
smaa-db     -> base de datos MySQL
```

## 3. Abrir en el computador

```text
http://localhost
```

## 4. Abrir desde un celular en la misma red WiFi

Primero obtener la IP del computador.

En Windows:

```powershell
ipconfig
```

Buscar la linea similar a:

```text
Direccion IPv4 . . . . . . . . . . : 192.168.1.25
```

Luego abrir en el celular:

```text
http://192.168.1.25
```

No usar `localhost` en el celular, porque `localhost` apunta al propio celular y no al computador.

## 5. Revisar contenedores activos

```bash
docker compose ps
```

## 6. Ver logs

Logs de la aplicacion completa:

```bash
docker logs -f smaa-app
```

Logs de MySQL:

```bash
docker logs -f smaa-db
```

## 7. Apagar el sistema

```bash
docker compose down
```

Para borrar tambien los datos de MySQL:

```bash
docker compose down -v
```

## 8. phpMyAdmin opcional

phpMyAdmin queda configurado como herramienta opcional. Para levantarlo:

```bash
docker compose --profile tools up -d phpmyadmin
```

Luego abrir:

```text
http://localhost:8081
```

Credenciales:

```text
Servidor: db
Usuario: root
Password: root
```

## 9. Estructura Docker actual

```text
Dockerfile                         -> construye la imagen unica smaa-app
nginx-single.conf                  -> configura Nginx para frontend y proxy /api
docker/start-single-container.sh   -> inicia backend y Nginx dentro del mismo contenedor
docker-compose.yml                 -> levanta smaa-app y MySQL
.dockerignore                      -> evita copiar archivos innecesarios a la imagen
```

## 10. Flujo interno

```text
Navegador PC / Celular
        ↓
http://IP_DEL_PC
        ↓
Nginx dentro de smaa-app
        ↓
Frontend HTML
        ↓
/api/*
        ↓
Backend Spring Boot interno en 127.0.0.1:8080
        ↓
MySQL en contenedor smaa-db
```
