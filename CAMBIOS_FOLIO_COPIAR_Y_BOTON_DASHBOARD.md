# Cambios: copiar folio y regreso al Dashboard Viajero

## Cambios aplicados

1. Se agregó un botón **Copiar folio** en la ventana emergente que aparece al crear una declaración desde `declaracion.html`.
2. El botón copia el valor mostrado en `successModalFolio` usando `navigator.clipboard` cuando está disponible.
3. Se agregó un método alternativo de copiado para navegadores o contextos donde `navigator.clipboard` no esté disponible.
4. Se agregó un botón **Volver al dashboard viajero** al extremo derecho del título en las páginas asociadas al Dashboard Viajero:
   - `declaracion.html`
   - `vehiculo.html`
   - `menores.html`
   - `sag.html`
   - `mascotas.html`
   - `comprobante.html`
5. Se agregaron estilos CSS responsivos para que el botón quede al lado derecho del título en escritorio y debajo del título en pantallas pequeñas.
6. Se actualizó la versión del script `app.js` en esas páginas para evitar caché antigua del navegador.

## Archivos modificados

- `smaa-frontend/js/app.js`
- `smaa-frontend/css/styles.css`
- `smaa-frontend/declaracion.html`
- `smaa-frontend/vehiculo.html`
- `smaa-frontend/menores.html`
- `smaa-frontend/sag.html`
- `smaa-frontend/mascotas.html`
- `smaa-frontend/comprobante.html`

## Prueba recomendada

1. Reconstruir Docker sin caché:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

2. Abrir `http://localhost` desde el PC.
3. Entrar como viajero.
4. Ir a **Crear declaración**.
5. Crear una declaración.
6. Verificar que aparece el folio y el botón **Copiar folio**.
7. Presionar **Copiar folio** y pegar el valor en otro campo o bloc de notas.
8. Verificar que las páginas del flujo viajero muestran el botón **Volver al dashboard viajero** junto al título.

## Consideración

En algunos navegadores móviles, la API moderna de copiado puede requerir contexto seguro. Por eso se agregó un método alternativo para copiar el folio mediante selección temporal de texto.
