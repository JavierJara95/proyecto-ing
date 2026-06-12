# Cambios aplicados: portal por roles y menú coherente

## Flujo nuevo

1. El usuario entra a `login.html`.
2. Si las credenciales son válidas, el frontend guarda el rol en `localStorage` con la clave `smaa_rol`.
3. El login redirige a `portal.html`.
4. `portal.html` muestra solo el acceso permitido según el rol:
   - `VIAJERO` → acceso a `dashboard-viajero.html`.
   - `FUNCIONARIO_ADUANAS` → acceso a `panel-funcionario.html`.

## Menú superior

Se actualizó el menú superior de todas las páginas para que sea coherente:

- Páginas públicas: `Inicio`, `Login`, `Registro`.
- Páginas de viajero: `Inicio`, `Viajero`, `Cerrar sesión`.
- Páginas de funcionario: `Inicio`, `Funcionario`, `Reportes`, `Cerrar sesión`.

## Control básico de acceso en frontend

Se agregó validación de rol en las páginas:

- Páginas de viajero requieren `VIAJERO`.
- Páginas de funcionario requieren `FUNCIONARIO_ADUANAS`.
- Si no hay sesión, vuelve al login.
- Si el rol no corresponde, vuelve al portal.

## Archivos modificados

- `smaa-frontend/login.html`
- `smaa-frontend/index.html`
- `smaa-frontend/registro.html`
- `smaa-frontend/dashboard-viajero.html`
- `smaa-frontend/declaracion.html`
- `smaa-frontend/vehiculo.html`
- `smaa-frontend/menores.html`
- `smaa-frontend/sag.html`
- `smaa-frontend/mascotas.html`
- `smaa-frontend/comprobante.html`
- `smaa-frontend/panel-funcionario.html`
- `smaa-frontend/reportes.html`
- `smaa-frontend/js/app.js`
- `smaa-frontend/css/styles.css`

## Archivo nuevo

- `smaa-frontend/portal.html`
