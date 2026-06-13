# Cambios QR, login y archivos de respaldo

## 1. Panel funcionario: alternativa de QR por archivo

Se mantuvo el botón **Escanear QR** para abrir la cámara en vivo cuando el navegador lo permita.

Si la cámara no logra leer el código o el navegador bloquea la lectura automática, ahora la alternativa visible es **Subir archivo QR**.

Cambios aplicados:

- Se cambió el texto del botón alternativo a **Subir archivo QR**.
- Se eliminó el atributo `capture="environment"` del input de archivo para no forzar la cámara del celular.
- El usuario puede seleccionar una imagen del QR guardada en el dispositivo.
- Si el QR se lee correctamente, se autocompleta el folio y se ejecuta la búsqueda del expediente.

Archivos modificados:

- `smaa-frontend/panel-funcionario.html`
- `smaa-frontend/js/app.js`

## 2. Login: limpieza automática de datos iniciales

Los campos del login conservan los datos de prueba iniciales, pero al hacer clic o empezar a escribir se limpian automáticamente una sola vez.

Campos afectados:

- Correo
- Password

Archivo modificado:

- `smaa-frontend/login.html`
- `smaa-frontend/js/app.js`

## 3. Login: botón para ver u ocultar contraseña

Se agregó un botón **Mostrar/Ocultar** al lado del campo de contraseña para revisar errores de tipeo antes de ingresar.

Archivos modificados:

- `smaa-frontend/login.html`
- `smaa-frontend/css/styles.css`
- `smaa-frontend/js/app.js`

## 4. Archivos de respaldo con nombres largos

El error se producía porque el nombre completo del archivo podía superar el tamaño admitido por la columna de base de datos.

Correcciones aplicadas:

- El frontend recorta automáticamente nombres largos antes de enviarlos.
- El backend también recorta el nombre si llega demasiado largo por API.
- Se aumentó la definición de `archivo_respaldo_nombre` en `schema.sql`.

Archivos modificados:

- `smaa-frontend/js/app.js`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/Vehiculo.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/MenorEdad.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/Mascota.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/DeclaracionSag.java`
- `smaa-backend/src/main/resources/schema.sql`

## Recomendación de prueba con Docker

Si ya existe una base de datos creada con la versión anterior, para probar desde cero se recomienda:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

El comando `down -v` borra el volumen anterior de MySQL. Úsalo solo si no necesitas conservar datos de prueba antiguos.
