-- Seed data for SMAA testing
-- This file is executed by Spring Boot after JPA schema initialization.

INSERT INTO usuarios (id, nombre, apellido, correo, documento, password, rol, activo) VALUES
  (1, 'Juan', 'Pérez', 'usuario@smaa.cl', '12345678-9', 'clave123', 'VIAJERO', true),
  (2, 'Ana', 'Gómez', 'funcionario@smaa.cl', '98765432-1', 'clave321', 'FUNCIONARIO_ADUANAS', true)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  apellido = VALUES(apellido),
  password = VALUES(password),
  rol = VALUES(rol),
  activo = VALUES(activo);

INSERT INTO declaraciones_viaje (id, folio, nombre_titular, documento_titular, fecha_viaje, paso_fronterizo, sentido_cruce, medio_transporte, estado, fecha_creacion) VALUES
  (1, 'FOLIO-001', 'Juan Pérez', '12345678-9', '2026-06-15', 'Los Libertadores', 'SALIDA', 'Automóvil', 'PENDIENTE', '2026-06-01 10:00:00'),
  (2, 'FOLIO-002', 'Ana Gómez', '98765432-1', '2026-06-20', 'Chacalluta', 'INGRESO', 'Bus', 'BORRADOR', '2026-06-02 11:30:00')
ON DUPLICATE KEY UPDATE
  nombre_titular = VALUES(nombre_titular),
  documento_titular = VALUES(documento_titular),
  fecha_viaje = VALUES(fecha_viaje),
  paso_fronterizo = VALUES(paso_fronterizo),
  sentido_cruce = VALUES(sentido_cruce),
  medio_transporte = VALUES(medio_transporte),
  estado = VALUES(estado),
  fecha_creacion = VALUES(fecha_creacion);

INSERT INTO vehiculos (id, patente, marca, modelo, anio, propietario, conductor_autorizado, fecha_salida, fecha_retorno, permiso_temporal, estado_permiso, declaracion_id) VALUES
  (1, 'ABC123', 'Toyota', 'Corolla', 2020, 'Juan Pérez', 'Juan Pérez', '2026-06-15', '2026-06-20', false, 'PENDIENTE', 1),
  (2, 'XYZ789', 'Mercedes', 'Sprinter', 2018, 'Ana Gómez', 'Carlos Muñoz', '2026-06-20', '2026-06-25', false, 'PENDIENTE', 2)
ON DUPLICATE KEY UPDATE
  marca = VALUES(marca),
  modelo = VALUES(modelo),
  anio = VALUES(anio),
  propietario = VALUES(propietario),
  conductor_autorizado = VALUES(conductor_autorizado),
  fecha_salida = VALUES(fecha_salida),
  fecha_retorno = VALUES(fecha_retorno),
  permiso_temporal = VALUES(permiso_temporal),
  estado_permiso = VALUES(estado_permiso),
  declaracion_id = VALUES(declaracion_id);

INSERT INTO declaraciones_sag (id, declara_productos, tipo_producto, producto_restringido, observacion, estado_revision, declaracion_id) VALUES
  (1, true, 'Frutas y verduras', false, 'No hay productos restringidos en el vehículo.', 'SIN_ALERTA', 1),
  (2, false, NULL, false, 'Pasajera sin declaración de SAG.', 'SIN_ALERTA', 2)
ON DUPLICATE KEY UPDATE
  declara_productos = VALUES(declara_productos),
  tipo_producto = VALUES(tipo_producto),
  producto_restringido = VALUES(producto_restringido),
  observacion = VALUES(observacion),
  estado_revision = VALUES(estado_revision),
  declaracion_id = VALUES(declaracion_id);

INSERT INTO menores_edad (id, nombre, documento, viaja_con_ambos_padres, tiene_autorizacion_notarial, observacion, estado_validacion, declaracion_id) VALUES
  (1, 'Sofía Pérez', '11111111-1', true, true, 'Menor acompañada por ambos padres.', 'PENDIENTE', 1),
  (2, 'Lucas Gómez', '22222222-2', false, true, 'Menor viaja solo con madre.', 'PENDIENTE', 2)
ON DUPLICATE KEY UPDATE
  documento = VALUES(documento),
  viaja_con_ambos_padres = VALUES(viaja_con_ambos_padres),
  tiene_autorizacion_notarial = VALUES(tiene_autorizacion_notarial),
  observacion = VALUES(observacion),
  estado_validacion = VALUES(estado_validacion),
  declaracion_id = VALUES(declaracion_id);

INSERT INTO mascotas (id, tipo_animal, nombre, certificado_sanitario, vacuna_vigente, observacion, declaracion_id) VALUES
  (1, 'Perro', 'Luna', true, true, 'Mascota con certificación sanitaria vigente.', 1),
  (2, 'Gato', 'Mia', false, true, 'Mascota sin certificado sanitario cargado.', 2)
ON DUPLICATE KEY UPDATE
  tipo_animal = VALUES(tipo_animal),
  nombre = VALUES(nombre),
  certificado_sanitario = VALUES(certificado_sanitario),
  vacuna_vigente = VALUES(vacuna_vigente),
  observacion = VALUES(observacion),
  declaracion_id = VALUES(declaracion_id);

INSERT INTO auditorias (id, usuario, accion, modulo, fecha_hora, detalle) VALUES
  (1, 'admin', 'LOGIN', 'USUARIOS', '2026-06-01 08:10:00', 'Inicio de sesión exitoso para administrador.'),
  (2, 'Ana Gómez', 'CREAR_DECLARACION', 'DECLARACIONES', '2026-06-02 09:20:00', 'Creó la declaración de ingreso con folio FOLIO-002.'),
  (3, 'Juan Pérez', 'AGREGAR_VEHICULO', 'VEHICULOS', '2026-06-15 11:45:00', 'Asoció el vehículo ABC123 a la declaración de viaje FOLIO-001.')
ON DUPLICATE KEY UPDATE
  usuario = VALUES(usuario),
  accion = VALUES(accion),
  modulo = VALUES(modulo),
  fecha_hora = VALUES(fecha_hora),
  detalle = VALUES(detalle);
