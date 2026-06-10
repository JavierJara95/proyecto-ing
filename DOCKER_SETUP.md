# Guía de ejecución Docker - SMAA

Esta guía explica cómo ejecutar el Sistema de Monitoreo y Aduana Automatizada (SMAA) con Docker y cómo acceder desde un celular conectado a la misma red WiFi.

## Cambios aplicados para compatibilidad Docker

- El frontend se sirve con **Nginx**.
- El frontend usa la ruta relativa `/api`, por lo que funciona desde `localhost` y desde la IP local del computador.
- Nginx redirige internamente `/api` hacia el contenedor `backend:8080`.
- El backend escucha en `0.0.0.0`, necesario para funcionar correctamente dentro del contenedor.
- MySQL tiene `healthcheck`, para que el backend espere a que la base de datos esté lista.
- Los puertos se publican con `0.0.0.0`, permitiendo acceso desde otros dispositivos de la red local.

## Requisitos previos

- Docker Desktop instalado.
- Docker Compose disponible.
- Computador y celular conectados a la misma red WiFi.

## Ejecutar el proyecto

Desde la carpeta raíz del proyecto, ejecutar:

```bash
docker compose up -d --build
```

Esto levantará:

| Servicio | URL desde el computador | Uso |
|---|---|---|
| Frontend | http://localhost | Aplicación web |
| Backend | http://localhost:8080/api | API Spring Boot |
| phpMyAdmin | http://localhost:8081 | Administración MySQL |
| MySQL | localhost:3306 | Base de datos |

## Acceso desde celular en la misma red WiFi

1. En el computador, abrir PowerShell o CMD.
2. Ejecutar:

```powershell
ipconfig
```

3. Buscar la **Dirección IPv4** del adaptador WiFi activo.
4. En el celular, abrir el navegador y escribir:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```

No usar `localhost` desde el celular.

## Configuración de rutas

El archivo:

```text
smaa-frontend/js/app.js
```

usa:

```js
const API = '/api';
```

El archivo:

```text
smaa-frontend/nginx.conf
```

redirige internamente:

```text
/api/  →  http://backend:8080/api/
```

Gracias a esto, el celular solo necesita entrar al frontend por la IP del computador. No necesita escribir `:8080` para consumir el backend.

## Datos de la base de datos Docker

```text
Base de datos: smaa_db
Usuario: root
Contraseña: root
Puerto: 3306
```

phpMyAdmin:

```text
http://localhost:8081
```

Credenciales:

```text
Servidor: db
Usuario: root
Contraseña: root
```

## Comandos útiles

Ver contenedores:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f
```

Ver logs solo del backend:

```bash
docker compose logs -f backend
```

Detener servicios:

```bash
docker compose down
```

Detener y borrar datos de MySQL:

```bash
docker compose down -v
```

Reconstruir todo:

```bash
docker compose up -d --build
```

## Solución de problemas

### El celular no abre la página

Revisar:

1. Computador y celular están en la misma red WiFi.
2. Se está usando la IP correcta del computador.
3. El firewall de Windows permite conexiones al puerto 80.
4. Docker está ejecutándose correctamente con `docker compose ps`.

### El puerto 80 está ocupado

Cambiar en `docker-compose.yml`:

```yaml
ports:
  - "0.0.0.0:80:80"
```

por ejemplo a:

```yaml
ports:
  - "0.0.0.0:8082:80"
```

Luego acceder desde el celular con:

```text
http://IP_DEL_PC:8082
```

### El backend no conecta con MySQL

Ver logs:

```bash
docker compose logs -f backend
```

Revisar que el servicio `db` esté en estado saludable:

```bash
docker compose ps
```

## Documento de acciones pendientes

Los datos que requieren intervención del usuario quedaron registrados en:

```text
CONFIGURACION_PENDIENTE_USUARIO.md
```
