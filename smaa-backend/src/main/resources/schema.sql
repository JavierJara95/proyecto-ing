SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS mascotas;
DROP TABLE IF EXISTS menores_edad;
DROP TABLE IF EXISTS declaraciones_sag;
DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS auditorias;
DROP TABLE IF EXISTS declaraciones_viaje;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  apellido VARCHAR(255),
  correo VARCHAR(255) NOT NULL,
  documento VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  rol VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE KEY uk_usuarios_correo (correo),
  UNIQUE KEY uk_usuarios_documento (documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE declaraciones_viaje (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  folio VARCHAR(255) NOT NULL,
  nombre_titular VARCHAR(255),
  documento_titular VARCHAR(255),
  fecha_viaje DATE,
  paso_fronterizo VARCHAR(255),
  sentido_cruce VARCHAR(50),
  medio_transporte VARCHAR(255),
  estado VARCHAR(50),
  fecha_creacion DATETIME,
  UNIQUE KEY uk_declaraciones_viaje_folio (folio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auditorias (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(255),
  accion VARCHAR(255),
  modulo VARCHAR(255),
  fecha_hora DATETIME,
  detalle VARCHAR(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehiculos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  patente VARCHAR(255) NOT NULL,
  marca VARCHAR(255),
  modelo VARCHAR(255),
  anio INT,
  propietario VARCHAR(255),
  conductor_autorizado VARCHAR(255),
  fecha_salida DATE,
  fecha_retorno DATE,
  permiso_temporal BOOLEAN DEFAULT FALSE,
  estado_permiso VARCHAR(50),
  archivo_respaldo_nombre VARCHAR(512),
  archivo_respaldo_tipo VARCHAR(255),
  archivo_respaldo_datos LONGTEXT,
  declaracion_id BIGINT,
  UNIQUE KEY uk_vehiculos_patente (patente),
  CONSTRAINT fk_vehiculos_declaracion FOREIGN KEY (declaracion_id) REFERENCES declaraciones_viaje(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE declaraciones_sag (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  declara_productos BOOLEAN DEFAULT FALSE,
  tipo_producto VARCHAR(255),
  producto_restringido BOOLEAN DEFAULT FALSE,
  observacion VARCHAR(1000),
  estado_revision VARCHAR(50),
  archivo_respaldo_nombre VARCHAR(512),
  archivo_respaldo_tipo VARCHAR(255),
  archivo_respaldo_datos LONGTEXT,
  declaracion_id BIGINT,
  CONSTRAINT fk_declaraciones_sag_declaracion FOREIGN KEY (declaracion_id) REFERENCES declaraciones_viaje(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE menores_edad (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  documento VARCHAR(255),
  viaja_con_ambos_padres BOOLEAN DEFAULT FALSE,
  tiene_autorizacion_notarial BOOLEAN DEFAULT FALSE,
  observacion VARCHAR(1000),
  estado_validacion VARCHAR(50),
  archivo_respaldo_nombre VARCHAR(512),
  archivo_respaldo_tipo VARCHAR(255),
  archivo_respaldo_datos LONGTEXT,
  declaracion_id BIGINT,
  CONSTRAINT fk_menores_edad_declaracion FOREIGN KEY (declaracion_id) REFERENCES declaraciones_viaje(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mascotas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tipo_animal VARCHAR(255),
  nombre VARCHAR(255),
  certificado_sanitario BOOLEAN DEFAULT FALSE,
  vacuna_vigente BOOLEAN DEFAULT FALSE,
  observacion VARCHAR(1000),
  archivo_respaldo_nombre VARCHAR(512),
  archivo_respaldo_tipo VARCHAR(255),
  archivo_respaldo_datos LONGTEXT,
  declaracion_id BIGINT,
  CONSTRAINT fk_mascotas_declaracion FOREIGN KEY (declaracion_id) REFERENCES declaraciones_viaje(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
