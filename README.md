# Sistema SMAA - Aduanas Chile

Aplicacion academica para agilizar procesos aduaneros en pasos fronterizos de Chile.

## Ejecucion recomendada con Docker

Esta version usa una sola imagen propia para frontend y backend:

```text
smaa-app = frontend HTML/CSS/JS + backend Spring Boot + Nginx
```

La base de datos MySQL se ejecuta en un contenedor separado.

### Levantar el proyecto

```bash
docker compose up -d --build
```

### Abrir en el PC

```text
http://localhost
```

### Abrir desde celular en la misma red WiFi

Buscar la IP del computador con:

```powershell
ipconfig
```

Luego abrir en el celular:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```

## Documentacion importante

- `DOCKER_SETUP.md`: guia de ejecucion Docker.
- `CONFIGURACION_PENDIENTE_USUARIO.md`: configuraciones que dependen del computador o red del usuario.
- `Dockerfile`: imagen unica frontend + backend.
- `docker-compose.yml`: servicios `smaa-app` y `smaa-db`.

## Correccion reciente

Se corrigio la creacion de declaraciones para que el backend genere el `folio` antes de guardar en MySQL. Tambien se reforzo la conexion desde celular evitando cache antigua de `app.js`.

Para aplicar los cambios despues de una version anterior, reconstruir sin cache:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Ver detalles en:

- `CORRECCION_FOLIO_Y_CONEXION_MOVIL.md`
