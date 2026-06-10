# Corrección de folio y conexión desde celular

## 1. Error corregido al crear declaración

Error detectado:

```text
Column 'folio' cannot be null
```

Causa:

El backend guardaba la declaración en la base de datos antes de asignar el campo `folio`. La tabla `declaraciones_viaje` tiene el campo `folio` como obligatorio, por eso MySQL rechazaba el `INSERT`.

Archivos modificados:

- `smaa-backend/src/main/java/cl/duoc/smaa/service/DeclaracionViajeService.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/repository/DeclaracionViajeRepository.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/DeclaracionViaje.java`

Solución aplicada:

- El folio ahora se genera antes de ejecutar `repository.save(declaracion)`.
- Se agregó validación para generar un folio único.
- El campo `folio` quedó explícitamente como no nulo en el modelo.

Formato actual del folio generado:

```text
SMAA-yyyyMMddHHmmss-0000
```

Ejemplo:

```text
SMAA-20260610153045-4821
```

## 2. Ajuste para conexión desde celular

Para que el celular pueda consultar datos sin intentar conectarse a `localhost`, el frontend debe consumir el backend usando una ruta relativa:

```javascript
const API = '/api';
```

Esto permite que el flujo sea:

```text
Celular -> http://IP_DEL_PC -> Nginx -> /api -> Backend Spring Boot -> MySQL
```

No se debe usar desde el celular:

```text
http://localhost:8080
```

porque `localhost` en el celular apunta al propio celular, no al computador.

## 3. Cambios aplicados para evitar caché antigua en celulares

Algunos celulares pueden conservar una versión antigua de `app.js`, especialmente si antes el proyecto apuntaba a `localhost:8080`.

Para evitar eso se aplicaron estos cambios:

- Se agregó versión al archivo JS en todos los HTML:

```html
<script src="js/app.js?v=20260610-folio-wifi"></script>
```

- Se configuró Nginx para no cachear HTML, JS ni CSS durante las pruebas.

Archivo modificado:

- `nginx-single.conf`

## 4. Cambios aplicados al arranque Docker

El script de inicio ahora espera a que:

1. MySQL esté disponible.
2. El backend Spring Boot esté disponible en el puerto 8080.
3. Luego recién inicia Nginx.

Archivo modificado:

- `docker/start-single-container.sh`

Esto evita que el celular o navegador reciba errores temporales de `fetch` porque Nginx se inició antes que el backend.

## 5. Pasos para probar nuevamente

Ejecutar desde la carpeta raíz del proyecto:

```bash
docker compose down
```

Luego reconstruir sin usar caché:

```bash
docker compose build --no-cache
```

Después levantar el sistema:

```bash
docker compose up -d
```

Revisar logs:

```bash
docker compose logs -f app
```

Desde el PC abrir:

```text
http://localhost
```

Desde el celular abrir:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```

## 6. Acciones que dependen del usuario

Estas acciones no pueden dejarse automáticas dentro del proyecto porque dependen del computador y de la red local:

1. Verificar la IP local del PC con `ipconfig`.
2. Confirmar que el celular esté conectado a la misma red WiFi.
3. Permitir el puerto 80 en el firewall de Windows.
4. No usar `localhost` desde el celular.
5. Si el celular ya había abierto el sistema antes, borrar caché del navegador o abrir en modo incógnito.
