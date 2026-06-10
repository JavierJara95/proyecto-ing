# Configuración pendiente por parte del usuario

Este documento registra los puntos que requieren datos o acciones del usuario antes de ejecutar el proyecto SMAA con Docker y acceder desde un celular en la misma red WiFi.

## 1. IP local del computador

Para abrir el sistema desde un celular, se debe obtener la IP local del computador donde se está ejecutando Docker.

En Windows, abrir PowerShell o CMD y ejecutar:

```powershell
ipconfig
```

Buscar la línea llamada **Dirección IPv4** en el adaptador WiFi activo. Ejemplo:

```text
192.168.1.25
```

Luego, desde el celular conectado a la misma red WiFi, abrir:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```

No usar `localhost` desde el celular, porque `localhost` apunta al propio celular y no al computador.

## 2. Firewall de Windows

Si el celular no abre la página, se debe permitir el acceso al puerto 80 en el firewall de Windows.

Puertos usados por el proyecto:

| Puerto | Uso | Necesario para celular |
|---|---|---|
| 80 | Frontend web con Nginx | Sí |
| 8080 | Backend API Spring Boot | Opcional |
| 8081 | phpMyAdmin | Opcional |
| 3306 | MySQL | No recomendado exponer fuera del PC |

Para el uso normal desde celular basta con permitir el puerto **80**.

## 3. Red WiFi

El computador y el celular deben estar conectados a la misma red WiFi.

Si el celular usa datos móviles o una red invitada separada, no podrá acceder al sistema del computador.

## 4. Puerto 80 ocupado

Si Docker indica que el puerto 80 está ocupado, se debe cerrar el programa que lo está usando o cambiar el puerto en `docker-compose.yml`.

Configuración actual:

```yaml
ports:
  - "0.0.0.0:80:80"
```

Alternativa si el puerto 80 está ocupado:

```yaml
ports:
  - "0.0.0.0:8082:80"
```

En ese caso, desde el celular se debe abrir:

```text
http://IP_DEL_PC:8082
```

## 5. Contraseña de MySQL

La configuración Docker usa estos datos:

```text
Base de datos: smaa_db
Usuario: root
Contraseña: root
Puerto: 3306
```

Si se cambia la contraseña de MySQL, también debe modificarse en `docker-compose.yml` y en las variables de entorno del servicio `backend`.

## 6. Ejecución local sin Docker

El proyecto quedó optimizado para Docker. Si se desea ejecutar el backend fuera de Docker con XAMPP u otro MySQL local, revisar estos valores en:

```text
smaa-backend/src/main/resources/application.properties
```

Valores actuales por defecto:

```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smaa_db
DB_USER=root
DB_PASSWORD=root
```

Si el MySQL local usa otro puerto, por ejemplo `3307`, se debe configurar la variable `DB_PORT=3307` antes de iniciar Spring Boot o cambiar el valor en `application.properties`.

## 7. Comandos principales

Desde la carpeta raíz del proyecto:

```bash
docker compose up -d --build
```

Ver estado:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f
```

Detener:

```bash
docker compose down
```

Detener y borrar datos de la base:

```bash
docker compose down -v
```
