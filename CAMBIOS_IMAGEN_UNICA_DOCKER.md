# Cambios realizados para usar una sola imagen Docker

## Objetivo

Reducir las imagenes propias del proyecto de dos imagenes separadas:

```text
smaa-frontend
smaa-backend
```

a una sola imagen:

```text
smaa-app
```

La base de datos MySQL se mantiene separada porque requiere persistencia de datos.

## Archivos creados

| Archivo | Proposito |
|---|---|
| `Dockerfile` | Construye la imagen unica `smaa-app`. Compila backend y copia frontend. |
| `nginx-single.conf` | Sirve los HTML y redirige `/api` al backend interno. |
| `docker/start-single-container.sh` | Inicia Spring Boot y Nginx dentro del mismo contenedor. |
| `.dockerignore` | Evita copiar archivos innecesarios durante la construccion. |
| `CAMBIOS_IMAGEN_UNICA_DOCKER.md` | Documenta este cambio. |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `docker-compose.yml` | Se reemplazaron los servicios `frontend` y `backend` por un solo servicio `app`. |
| `DOCKER_SETUP.md` | Se actualizo la guia para la nueva ejecucion. |
| `README.md` | Se actualizaron instrucciones basicas. |
| `CONFIGURACION_PENDIENTE_USUARIO.md` | Se actualizaron puntos que dependen del usuario. |

## Resultado esperado

Al ejecutar:

```bash
docker compose up -d --build
```

Docker construira una imagen propia:

```text
smaa-app:latest
```

Y levantara los contenedores principales:

```text
smaa-app
smaa-db
```

El sistema se abre en:

```text
http://localhost
```

Desde celular en la misma red WiFi:

```text
http://IP_DEL_PC
```
