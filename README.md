# SMAA - Sistema de Monitoreo y Aduana Automatizada

Aplicación web académica para apoyar la digitalización de procesos aduaneros en pasos fronterizos de Chile.

## Ejecución recomendada con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

Abrir en el computador:

```text
http://localhost
```

Para abrir desde un celular conectado a la misma red WiFi, obtener la IP local del computador con `ipconfig` y entrar a:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```

## Servicios Docker

| Servicio | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080/api |
| phpMyAdmin | http://localhost:8081 |
| MySQL | localhost:3306 |

## Documentación incluida

- `DOCKER_SETUP.md`: guía completa de ejecución Docker y acceso desde celular.
- `CONFIGURACION_PENDIENTE_USUARIO.md`: datos y acciones que dependen del computador/red del usuario.
