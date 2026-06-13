# Corrección 413 y selector de archivo QR

## Problemas corregidos

1. En celular seguía apareciendo `Request Entity Too Large` al subir archivos de respaldo.
2. En celular, la opción alternativa de QR abría directamente la cámara en vez de permitir seleccionar un archivo.

## Cambios aplicados

### Límite de carga

Se aumentó el límite de solicitudes en:

- `nginx-single.conf`
- `smaa-frontend/nginx.conf`
- `smaa-backend/src/main/resources/application.properties`

Nginx ahora permite solicitudes de hasta `50M` mediante:

```nginx
client_max_body_size 50M;
```

Spring Boot también quedó configurado con límites de `50MB`.

### Selector de archivo QR

En `panel-funcionario.html` se cambió el input alternativo del QR para que no use `image/*`, porque en algunos celulares eso fuerza la cámara. Ahora usa extensiones específicas:

```html
accept=".png,.jpg,.jpeg,.webp,.gif"
```

Esto favorece que Android/iPhone muestren el selector de archivos o galería en vez de abrir directamente la cámara.

### Validación en frontend

En `js/app.js` se agregó validación para aceptar solamente imágenes QR con extensiones:

- PNG
- JPG
- JPEG
- WEBP
- GIF

Además, el límite visual del respaldo se ajustó a 10 MB para evitar cargas excesivas desde celular.

## Importante para probar

Ejecutar reconstrucción sin caché:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

Luego limpiar caché del navegador del celular o abrir en modo incógnito.
