# Cambios panel funcionario: expediente responsive y escáner QR

## Objetivo
Se optimizó el panel funcionario para que el resultado de búsqueda de expedientes pueda visualizarse correctamente tanto en navegador de computador como en smartphone. También se incorporó una opción para abrir la cámara del celular desde el panel funcionario y escanear el código QR del comprobante.

## Archivos modificados

- `smaa-frontend/panel-funcionario.html`
- `smaa-frontend/js/app.js`
- `smaa-frontend/css/styles.css`

## Cambios realizados

### 1. Resultado de expediente con scroll real
El modal de resultado del expediente ahora usa una estructura específica:

- `expediente-modal-content`
- `expediente-modal-body`
- `expediente-table-wrap`
- `expediente-table`

Esto permite:

- Limitar la altura máxima del popup.
- Habilitar scroll vertical y horizontal cuando la información es extensa.
- Evitar que el resultado cubra toda la pantalla sin posibilidad de desplazamiento.
- Ver mejor los registros asociados en computador y celular.

### 2. Visualización móvil optimizada
En pantallas pequeñas, la tabla del expediente se adapta como tarjetas verticales para evitar que los datos queden cortados.

El detalle de cada registro se muestra con pares campo/valor para facilitar lectura de:

- Declaración de viaje.
- Vehículos.
- Menores.
- Mascotas.
- Declaraciones SAG.
- Archivos de respaldo.

### 3. Botón para escanear QR
En `panel-funcionario.html`, dentro de “Buscar expediente”, se agregó el botón:

```text
Escanear QR
```

Este botón abre el panel de escaneo QR.

### 4. Lectura QR desde cámara o imagen
Se agregaron funciones JavaScript para:

- Abrir cámara en vivo cuando el navegador lo permite.
- Leer el QR usando `BarcodeDetector`.
- Extraer automáticamente el folio desde URLs como:

```text
panel-funcionario.html?buscarFolio=SMAA-2026-0001
```

- Completar el input de folio.
- Ejecutar automáticamente la búsqueda del expediente.

### 5. Compatibilidad smartphone
En redes locales usando `http://IP_DEL_PC`, algunos navegadores móviles bloquean la cámara en vivo por seguridad. Por eso se agregó una alternativa:

```text
Subir archivo QR
```

Ese botón abre la cámara o galería del celular mediante un input de archivo con `capture="environment"`.

## Consideraciones importantes

Para cámara en vivo, los navegadores modernos suelen requerir:

- HTTPS, o
- `localhost`.

Si se entra desde el celular usando:

```text
http://IP_DEL_PC
```

puede que el navegador bloquee la cámara en vivo. En ese caso, se debe usar la opción:

```text
Subir archivo QR
```

## Prueba recomendada

1. Levantar el proyecto:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

2. Entrar desde PC:

```text
http://localhost
```

3. Entrar desde celular:

```text
http://IP_DEL_PC
```

4. Ir a `panel-funcionario.html`.
5. Presionar `Escanear QR`.
6. Escanear el QR del comprobante.
7. Verificar que el folio se autocomplete y que el expediente se busque automáticamente.
