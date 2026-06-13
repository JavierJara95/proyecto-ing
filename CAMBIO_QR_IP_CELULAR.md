# Corrección QR para celular en la misma red WiFi

## Problema corregido

Cuando el sistema se abría en el computador usando `http://localhost`, el código QR generado también quedaba apuntando a `localhost`.

Al escanear ese QR desde un celular, `localhost` apunta al propio celular, no al computador, por eso no redirigía correctamente al panel funcionario.

## Cambios aplicados

- Se agregó `smaa-frontend/js/config.js`.
- Se agregó lógica en `smaa-frontend/js/app.js` para generar QR con una URL pública accesible desde el celular.
- Si el sistema está abierto como `localhost`, el navegador solicita la URL/IP del PC una vez y la guarda en `localStorage`.
- Si el sistema se abre directamente desde `http://IP_DEL_PC`, el QR se genera automáticamente con esa IP.
- En Docker, `docker/start-single-container.sh` genera `config.js` usando la variable `SMAA_PUBLIC_BASE_URL`.
- `docker-compose.yml` incluye la variable opcional `SMAA_PUBLIC_BASE_URL`.

## Forma recomendada de uso

Desde el PC, no abras el sistema con `localhost` cuando necesites crear QR para celular. Ábrelo con la IP del PC:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```

Así los QR generados también usarán esa IP.

## Alternativa con Docker

Antes de levantar Docker, puedes definir la IP pública del PC.

En Windows PowerShell:

```powershell
$env:SMAA_PUBLIC_BASE_URL="http://192.168.1.25"
docker compose down
docker compose build --no-cache
docker compose up -d
```

En CMD:

```cmd
set SMAA_PUBLIC_BASE_URL=http://192.168.1.25
docker compose down
docker compose build --no-cache
docker compose up -d
```

Si no defines la variable y generas un QR desde `localhost`, el sistema pedirá la URL/IP del PC la primera vez.

## Cómo borrar una IP guardada incorrecta

Si ingresaste mal la IP, abre la consola del navegador y ejecuta:

```javascript
localStorage.removeItem('smaaPublicBaseUrl')
```

Luego vuelve a generar el QR.
