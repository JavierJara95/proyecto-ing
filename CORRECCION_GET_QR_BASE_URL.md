# Corrección getQrBaseUrl is not defined

Se corrigió el error JavaScript `getQrBaseUrl is not defined`.

## Causa

El frontend generaba códigos QR llamando a `getQrBaseUrl()`, pero la función no estaba declarada en `smaa-frontend/js/app.js`.

## Cambios aplicados

- Se agregó `getQrBaseUrl()` en `smaa-frontend/js/app.js`.
- Se agregó `normalizeBaseUrl()` para limpiar barras finales.
- Se agregó detección de `localhost`, `127.0.0.1` y `::1`.
- Si existe `window.SMAA_PUBLIC_BASE_URL`, el QR usa esa URL.
- Si se abre desde una IP local, el QR usa automáticamente `window.location.origin`.
- Si se abre desde `localhost`, el sistema solicita la IP del PC para generar QR escaneables desde celular.
- Se actualizó la versión de `app.js` y `config.js` en los HTML para evitar caché antigua del navegador.

## Recomendación

Para probar sin caché:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Luego abrir el sistema desde el PC usando la IP local cuando se quiera escanear desde celular:

```text
http://IP_DEL_PC
```

Ejemplo:

```text
http://192.168.1.25
```
