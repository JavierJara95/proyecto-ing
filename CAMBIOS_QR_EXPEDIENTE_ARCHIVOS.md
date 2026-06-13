# Cambios QR, expediente completo y archivos de respaldo

## Cambios incorporados

### 1. QR hacia panel funcionario con folio autocompletado
- El QR generado al crear una declaración conserva la ruta `panel-funcionario.html?buscarFolio=<folio>`.
- Al abrir `panel-funcionario.html` con ese parámetro, el campo `Folio` se completa automáticamente.
- Además, el sistema ejecuta la búsqueda del expediente después de completar el folio.

Archivos modificados:
- `smaa-frontend/js/app.js`
- `smaa-frontend/panel-funcionario.html`

### 2. Eliminación del botón Inicio en menús superiores
- Se eliminó el botón `Inicio` de los menús superiores generados dinámicamente.
- Se mantiene el acceso al portal correspondiente y el cierre de sesión.

Archivo modificado:
- `smaa-frontend/js/app.js`

### 3. Búsqueda de expediente completo por folio
Al buscar un expediente por folio desde el panel funcionario, ahora se muestra en una misma tabla:
- Declaración de viaje.
- Vehículos asociados.
- Menores asociados.
- Mascotas asociadas.
- Declaraciones SAG asociadas.
- Archivo de respaldo asociado a cada registro, cuando exista.

Archivos modificados:
- `smaa-backend/src/main/java/cl/duoc/smaa/controller/FiscalizacionController.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/service/FiscalizacionService.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/repository/VehiculoRepository.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/service/VehiculoService.java`
- `smaa-frontend/js/app.js`

### 4. Archivos de respaldo en registros asociados
Se agregó carga opcional de archivos de respaldo en:
- Registro de vehículo.
- Registro de menor de edad.
- Registro de mascota.
- Declaración SAG.

Formatos permitidos desde el frontend:
- PDF
- JPG / JPEG
- PNG
- DOC / DOCX

Límite aplicado desde el frontend:
- 5 MB por archivo.

Los archivos se guardan como texto Base64 en la base de datos para mantener el proyecto simple y fácil de ejecutar en Docker.

Archivos modificados:
- `smaa-frontend/vehiculo.html`
- `smaa-frontend/menores.html`
- `smaa-frontend/mascotas.html`
- `smaa-frontend/sag.html`
- `smaa-frontend/js/app.js`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/Vehiculo.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/MenorEdad.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/Mascota.java`
- `smaa-backend/src/main/java/cl/duoc/smaa/model/DeclaracionSag.java`
- `smaa-backend/src/main/resources/schema.sql`

## Cómo probar

1. Levantar el sistema con Docker:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

2. Ingresar como viajero.
3. Crear una declaración.
4. Escanear el QR o abrir la URL generada.
5. Ingresar como funcionario, si el sistema lo solicita.
6. Verificar que el campo `Folio` del panel funcionario se complete automáticamente.
7. Buscar el expediente y revisar que se muestren todos los registros asociados.

## Importante

Si ya existe una base de datos MySQL anterior, puede mantener la estructura antigua sin las columnas nuevas. Para pruebas limpias, se recomienda ejecutar:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

El comando `down -v` elimina el volumen de MySQL y recrea las tablas con la estructura nueva. Esto borra datos previos de prueba.
