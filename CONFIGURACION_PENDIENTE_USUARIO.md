# Configuracion pendiente por parte del usuario

Este archivo registra los puntos que dependen del computador, red o decision del usuario y que no pueden quedar definidos automaticamente dentro del proyecto.

## 1. IP local del computador

Para entrar desde un celular conectado a la misma red WiFi, se debe conocer la IP local del PC.

En Windows ejecutar:

```powershell
ipconfig
```

Buscar:

```text
Direccion IPv4
```

Ejemplo:

```text
192.168.1.25
```

Desde el celular abrir:

```text
http://192.168.1.25
```

## 2. Firewall de Windows

Si el celular no abre la pagina, permitir conexiones entrantes al puerto 80.

Puerto requerido:

```text
80 TCP
```

El backend no necesita exponerse en el puerto 8080, porque Nginx redirige internamente las rutas `/api`.

## 3. Puerto 80 ocupado

Si Docker muestra error porque el puerto 80 esta ocupado, existen dos opciones:

### Opcion A: liberar puerto 80

Cerrar o detener programas que usen el puerto 80, por ejemplo IIS, Apache, XAMPP u otro servidor local.

### Opcion B: cambiar puerto externo

En `docker-compose.yml`, cambiar:

```yaml
ports:
  - "0.0.0.0:80:80"
```

por ejemplo a:

```yaml
ports:
  - "0.0.0.0:8085:80"
```

Luego entrar desde el PC:

```text
http://localhost:8085
```

Y desde celular:

```text
http://IP_DEL_PC:8085
```

## 4. Credenciales de MySQL

Actualmente la configuracion Docker usa:

```text
Base de datos: smaa_db
Usuario: root
Password: root
```

Si se cambia la clave o el nombre de la base de datos, tambien se deben actualizar las variables del servicio `app` en `docker-compose.yml`:

```yaml
DB_NAME: smaa_db
DB_USER: root
DB_PASSWORD: root
```

## 5. phpMyAdmin opcional

phpMyAdmin no se levanta por defecto. Para activarlo:

```bash
docker compose --profile tools up -d phpmyadmin
```

Luego abrir:

```text
http://localhost:8081
```

## 6. Verificacion despues de cambios

Despues de modificar configuraciones Docker, reconstruir con:

```bash
docker compose down
docker compose up -d --build
```

## Corrección adicional: folio y prueba desde celular

Se agregó el documento `CORRECCION_FOLIO_Y_CONEXION_MOVIL.md` con los cambios aplicados y las pruebas recomendadas.

Acciones pendientes del usuario:

1. Ejecutar `docker compose down`.
2. Ejecutar `docker compose build --no-cache`.
3. Ejecutar `docker compose up -d`.
4. Entrar desde el celular usando `http://IP_DEL_PC`, no `localhost`.
5. Si el celular mantiene el error de `fetch`, borrar caché del navegador o usar modo incógnito.
