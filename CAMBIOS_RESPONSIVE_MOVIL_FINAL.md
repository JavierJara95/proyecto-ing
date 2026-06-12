# Corrección responsive móvil final

Se reforzaron los cambios para que se vean en smartphone:

- Se agregó versión al CSS y JS para evitar caché del navegador.
- Se aplicaron reglas responsive con mayor prioridad.
- Se corrigió el menú superior en pantallas pequeñas.
- Se ajustaron formularios, tarjetas, botones, modales y tablas.
- Se mantuvo el formato institucional basado en dashboard-viajero.html.

IMPORTANTE: si se ejecuta con Docker, reconstruir la imagen:

```bash
docker compose down
docker compose up -d --build
```

En el celular, abrir nuevamente la IP del computador y actualizar la página.
